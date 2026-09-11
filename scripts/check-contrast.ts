/**
 * Audit de contraste de la palette configuree dans le `.env`.
 *
 * Usage : npm run theme:check
 *
 * Le script affiche la palette generee, puis verifie chaque couple
 * texte / fond selon les seuils WCAG definis dans le `.env`. Il sort en code 1
 * si un couple reste sous le seuil apres ajustement automatique.
 */

import { loadEnv } from 'vite';
import { buildTheme } from '../src/theme/buildTheme';
import { RAMP_STOPS } from '../src/theme/referenceRamps';
import { ROLE_ENV_KEYS, THEME_ROLES } from '../src/theme/themeConfig';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'VITE_');
const theme = buildTheme(env as Record<string, string | undefined>);

const pad = (value: string, width: number) => value.padEnd(width);

console.log('\nPALETTE GENEREE');
console.log('='.repeat(72));
for (const role of THEME_ROLES) {
  console.log(`\n${pad(role, 10)} (${ROLE_ENV_KEYS[role]} = ${theme.config.seeds[role]})`);
  console.log(
    '  ' +
      RAMP_STOPS.map((stop) => `${stop}:${theme.ramps[role][stop]}`).join('  ')
  );
}

console.log('\n\nJETONS SEMANTIQUES');
console.log('='.repeat(72));
const tokenNames = Object.keys(theme.light);
console.log(`  ${pad('jeton', 20)} ${pad('clair', 10)} sombre`);
for (const name of tokenNames) {
  console.log(`  ${pad(name, 20)} ${pad(theme.light[name], 10)} ${theme.dark[name]}`);
}

console.log('\n\nCONTRASTE (WCAG 2.1)');
console.log('='.repeat(72));
let failures = 0;
for (const mode of ['light', 'dark'] as const) {
  console.log(`\nMode ${mode === 'light' ? 'clair' : 'sombre'}`);
  for (const check of theme.checks.filter((item) => item.mode === mode)) {
    const status = check.passes ? 'OK  ' : 'ECHEC';
    if (!check.passes) failures += 1;
    console.log(
      `  ${status} ${pad(check.pair, 34)} ${pad(`${check.ratio}:1`, 9)} (min ${check.required}:1)`
    );
  }
}

if (theme.config.warnings.length > 0) {
  console.log('\n\nAVERTISSEMENTS DE CONFIGURATION');
  console.log('='.repeat(72));
  for (const warning of theme.config.warnings) console.log(`  - ${warning}`);
}

console.log('');
if (failures > 0) {
  console.error(
    `${failures} couple(s) texte/fond sous le seuil de contraste. Ajustez les variables VITE_THEME_* du .env.`
  );
  process.exit(1);
}
console.log('Tous les couples texte/fond respectent les seuils de contraste configures.');
