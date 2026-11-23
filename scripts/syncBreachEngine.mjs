import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../../node_modules/esbuild/lib/main.js";
import { parseSync } from "../../node_modules/oxc-parser/src-js/index.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const parent = path.resolve(root, "..");

const declaredNames = (statement) => {
  const declaration = statement.declaration ?? statement;
  if (declaration.id?.name) return [declaration.id.name];
  return (declaration.declarations ?? []).map((d) => d.id?.name);
};

const valueExports = (program) =>
  program.body.flatMap((statement) => {
    if (
      (statement.type === "ExportAllDeclaration" &&
        statement.exportKind !== "type") ||
      statement.type === "ExportDefaultDeclaration"
    )
      throw new Error("OpenFront snapshot module shape changed");
    if (statement.type !== "ExportNamedDeclaration") return [];
    if (statement.exportKind === "type") return [];
    if (statement.declaration) {
      const { type } = statement.declaration;
      if (type === "TSInterfaceDeclaration" || type === "TSTypeAliasDeclaration")
        return [];
      return declaredNames(statement);
    }
    return statement.specifiers
      .filter((specifier) => specifier.exportKind !== "type")
      .map((specifier) => specifier.exported.name);
  });

// Snapshot schemas are built at module load, so their code cannot be shaken
// out. The simulation never snapshots; a value that absorbs every use stands in.
const STUB = `const stub = new Proxy(function () {}, {
  get: (_, key) => (key === "then" || typeof key === "symbol" ? undefined : stub),
  apply: () => stub,
  construct: () => stub,
});`;
const stubModule = (names) =>
  `${STUB}\n${names.map((name) => `export const ${name} = stub;`).join("\n")}`;

const KEPT = [
  {
    filter: /\/engine-api\/src\/game\/GameTypes\.ts$/,
    names: ["UnitType", "GameType", "MessageType"],
  },
  { filter: /\/engine\/src\/game\/Game\.ts$/, names: ["isUnit"] },
  { filter: /\/engine-lib\/src\/Util\.ts$/, names: ["within"] },
];

const result = await build({
  absWorkingDir: parent,
  stdin: {
    contents: `export { SAMLauncherExecution } from '@openfront/engine/execution/SAMLauncherExecution';
export { ParabolaUniversalPathFinder } from '@openfront/engine/pathfinding/PathFinder.Parabola';
export { UnitGrid } from '@openfront/engine-lib/game/UnitGrid';`,
    resolveDir: parent,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  write: false,
  metafile: true,
  plugins: [
    {
      name: "air-path-only",
      setup(builder) {
        builder.onResolve({ filter: /^zod$/ }, () => ({
          path: "zod",
          namespace: "stub",
        }));
        builder.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
          loader: "js",
          contents: stubModule(["z"]),
        }));

        builder.onLoad(
          { filter: /\/snapshot\/[^/]+\.ts$|\/StatsSchemas\.ts$/ },
          async (args) => {
            const source = await readFile(args.path, "utf8");
            const { program } = parseSync(args.path, source);
            return { loader: "js", contents: stubModule(valueExports(program)) };
          },
        );

        for (const { filter, names } of KEPT) {
          builder.onLoad({ filter }, async (args) => {
            const source = await readFile(args.path, "utf8");
            const { program } = parseSync(args.path, source);
            const selected = program.body.filter((statement) =>
              declaredNames(statement).some((name) => names.includes(name)),
            );
            const found = selected.flatMap(declaredNames);
            if (!names.every((name) => found.includes(name)))
              throw new Error(`OpenFront engine exports changed: ${args.path}`);
            return {
              loader: "ts",
              contents: selected
                .map((statement) => source.slice(statement.start, statement.end))
                .join("\n"),
            };
          });
        }

        builder.onLoad(
          { filter: /\/pathfinding\/PathFinder\.ts$/ },
          async (args) => {
            const source = await readFile(args.path, "utf8");
            const start = source.indexOf("  static Air(game: Game)");
            const end = source.indexOf("\n  }", start) + 4;
            if (start < 0 || end < start)
              throw new Error("OpenFront Air path factory changed");
            return {
              loader: "ts",
              resolveDir: path.dirname(args.path),
              contents: `
import { AirPathFinder } from './PathFinder.Air';
import { PathFinderBuilder } from './PathFinderBuilder';
export class PathFinding { ${source.slice(start, end)} }
`,
            };
          },
        );
      },
    },
  ],
});
const hashes = {};
for (const name of [
  ...new Set([
    ...Object.keys(result.metafile.inputs).filter(
      (p) => p !== "<stdin>" && !p.startsWith("stub:"),
    ),
    "packages/engine/src/execution/NukeExecution.ts",
    "packages/engine/src/execution/ConstructionExecution.ts",
    "packages/engine/src/execution/MissileSiloExecution.ts",
    "packages/engine-lib/src/configuration/Config.ts",
    "packages/engine/src/game/PlayerImpl.ts",
    "packages/engine/src/game/UnitImpl.ts",
  ]),
].sort()) {
  hashes[name] = createHash("sha256")
    .update(await readFile(path.join(parent, name)))
    .digest("hex");
}
const artifact =
  "// Generated from OpenFront (AGPL-3.0); see openfront-LICENSE and openfront-sources.json.\n" +
  result.outputFiles[0].text;
const output = path.join(root, "src/api/vendor");
if (process.argv.includes("--check")) {
  if (
    (await readFile(path.join(output, "openfront.js"), "utf8")) !== artifact ||
    (await readFile(path.join(output, "openfront-sources.json"), "utf8")) !==
      JSON.stringify(hashes, null, 2) + "\n"
  ) {
    throw new Error(
      "Vendored OpenFront engine is stale. Run npm run sync:breach-engine and revalidate.",
    );
  }
} else {
  await writeFile(path.join(output, "openfront.js"), artifact);
  await writeFile(
    path.join(output, "openfront-sources.json"),
    JSON.stringify(hashes, null, 2) + "\n",
  );
  await writeFile(
    path.join(output, "openfront-LICENSE"),
    await readFile(path.join(parent, "LICENSE")),
  );
}
console.log(
  `OpenFront breach engine: ${artifact.length} bytes, ${Object.keys(hashes).length} source files`,
);
