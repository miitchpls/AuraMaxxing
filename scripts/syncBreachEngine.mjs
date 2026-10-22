import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../../node_modules/esbuild/lib/main.js";
import ts from "../../node_modules/typescript/lib/typescript.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const parent = path.resolve(root, "..");
const result = await build({
  absWorkingDir: parent,
  stdin: {
    contents: `export { SAMLauncherExecution } from './src/core/execution/SAMLauncherExecution';
export { ParabolaUniversalPathFinder } from './src/core/pathfinding/PathFinder.Parabola';
export { UnitGrid } from './src/core/game/UnitGrid';`,
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
        builder.onLoad(
          { filter: /\/core\/(Util|game\/Game)\.ts$/ },
          async (args) => {
            const source = await readFile(args.path, "utf8");
            const parsed = ts.createSourceFile(
              args.path,
              source,
              ts.ScriptTarget.Latest,
              true,
            );
            const names = args.path.endsWith("/Util.ts")
              ? ["within"]
              : ["UnitType", "GameType", "MessageType", "isUnit"];
            const selected = parsed.statements.filter((s) =>
              names.includes(s.name?.text),
            );
            if (selected.length !== names.length)
              throw new Error("OpenFront engine exports changed");
            return {
              loader: "ts",
              contents: selected.map((s) => s.getText(parsed)).join("\n"),
            };
          },
        );

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
    ...Object.keys(result.metafile.inputs).filter((p) => p !== "<stdin>"),
    "src/core/execution/NukeExecution.ts",
    "src/core/execution/ConstructionExecution.ts",
    "src/core/execution/MissileSiloExecution.ts",
    "src/core/configuration/Config.ts",
    "src/core/game/PlayerImpl.ts",
    "src/core/game/UnitImpl.ts",
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
