const REQUEST = "auramaxxing:game-request";
const RESPONSE = "auramaxxing:game-response";

const reply = (data) =>
  window.dispatchEvent(
    new CustomEvent(RESPONSE, { detail: JSON.stringify(data) }),
  );

const inspect = async ({ id, screenX, screenY, unitType }) => {
  const element = document.querySelector("build-menu");
  const game = element?.game;
  const transform = element?.transformHandler;
  const player = game?.myPlayer?.();
  if (!game || !transform || !player) return reply({ id, ready: false });

  const world = transform.screenToWorldCoordinates(screenX, screenY);
  if (!world || !game.isValidCoord(world.x, world.y)) {
    return reply({ id, ready: true, valid: false });
  }

  const found = await player.buildables(game.ref(world.x, world.y), [unitType]);
  const unit = (Array.isArray(found) ? found : [found])[0];
  reply({
    id,
    ready: true,
    valid: true,
    canBuild: unit?.canBuild !== false,
    canUpgrade: unit?.canUpgrade !== false,
    cost: String(unit?.cost ?? 0),
    gold: String(player.gold()),
  });
};

window.addEventListener(REQUEST, (event) => {
  const request = JSON.parse(event.detail);
  inspect(request).catch(() => reply({ id: request.id, ready: false }));
});

document.documentElement.dataset.auramaxxingBridge = "1";
