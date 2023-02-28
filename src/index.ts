import { Injector, Logger, plugins, themes } from "replugged";

const inject = new Injector();
const logger = new Logger("Plugin", "QuickToggle");

let themesDisabled = false;
let pluginsDisabled = false;
let isRunning = false;

export function start(): void {
  document.addEventListener("keydown", async (e: KeyboardEvent) => {
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
            plugins.disable(id).catch(() => {
              logger.log(`${name} is already stopped`);
            });
            console.log(`${name} is stopped`);
          }
        }
    }
    isRunning = false;
  });
}

export function stop(): void {
  inject.uninjectAll();
}
