/**
 * Plugin Vite : genere la feuille de style de la palette depuis le fichier `.env`.
 *
 * La CSS est produite au demarrage (et regeneree quand le `.env` change), ce qui
 * evite tout calcul de couleur au runtime et tout clignotement au chargement.
 */

import type { Plugin, ViteDevServer } from 'vite';
import { loadEnv } from 'vite';
import { buildTheme, themeToCss } from '../src/theme/buildTheme';

const VIRTUAL_ID = 'virtual:theme.css';
const RESOLVED_ID = '\0virtual:theme.css';

export function themePalettePlugin(): Plugin {
  let envDir = process.cwd();
  let mode = 'development';
  let css = '';
  let server: ViteDevServer | undefined;

  const regenerate = (announce: boolean) => {
    const env = loadEnv(mode, envDir, 'VITE_');
    const theme = buildTheme(env as Record<string, string | undefined>);
    css = themeToCss(theme);

    if (announce) {
      for (const warning of theme.warnings) {
        console.warn(`[theme] ${warning}`);
      }
    }
    return theme;
  };

  return {
    name: 'math3d-theme-palette',
    enforce: 'pre',

    configResolved(config) {
      envDir = config.envDir || config.root;
      mode = config.mode;
      regenerate(true);
    },

    configureServer(devServer) {
      server = devServer;
      devServer.watcher.add(['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`]);
      devServer.watcher.on('change', (file) => {
        if (!/(^|[\\/])\.env(\.|$)/.test(file)) return;
        regenerate(true);
        const virtualModule = devServer.moduleGraph.getModuleById(RESOLVED_ID);
        if (virtualModule) devServer.moduleGraph.invalidateModule(virtualModule);
        devServer.ws.send({ type: 'full-reload' });
        console.info('[theme] Palette rechargee depuis le .env');
      });
    },

    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null;
      if (!css) regenerate(false);
      return css;
    },
  };
}

export { VIRTUAL_ID as THEME_VIRTUAL_MODULE_ID };
