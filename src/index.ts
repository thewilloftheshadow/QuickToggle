import { Logger, plugins, themes } from "replugged";

const logger = new Logger("Plugin", "QuickToggle");

let themesDisabled = false;
let pluginsDisabled = false;
let isRunning = false;

async function checkKeyDown(e: KeyboardEvent): Promise<void> {
  if (isRunning) return;
  isRunning = true;
  if (e.repeat) return;
  switch (e.key) {
    case "F6": // toggle themes
      if (themesDisabled) {
        themes.loadAll();
        logger.log("Loading all themes");
        themesDisabled = false;
      } else {
        themes.unloadAll();
        logger.log("Unloading all themes");
        themesDisabled = true;
      }
      break;

    case "F7": // toggle plugins
      if (pluginsDisabled) {
        await plugins.startAll();
        logger.log("Starting all plugins");
        pluginsDisabled = false;
      } else {
        const disabled = plugins.getDisabled();

        for (const plugin of plugins.plugins) {
          const id = plugin[0];
          const { name } = plugin[1].manifest;
          if (disabled.includes(plugin[0])) continue;
          if (plugin[0] === "dev.shadow.quicktoggle") continue;
          await plugins.stop(id).catch(() => {
            logger.log(`${name} is already stopped or failed to stop`);
          });
          console.log(`${name} is stopped`);
        }
        pluginsDisabled = true;
      }
  }
  isRunning = false;
}

export function start(): void {
  document.addEventListener("keydown", checkKeyDown);
}

export function stop(): void {
  document.removeEventListener("keydown", checkKeyDown);
}
