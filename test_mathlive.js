import { MathfieldElement } from 'mathlive';
const mf = new MathfieldElement();
console.log(Object.keys(mf.inlineShortcuts || {}).length);
