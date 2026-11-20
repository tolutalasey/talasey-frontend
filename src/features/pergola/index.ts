export { PergolaProduct, type Design } from './components/PergolaProduct';
export { BuilderLinks } from './components/BuilderLinks';
export { PergolaAddOnLinks } from './components/PergolaAddOnLinks';
export {
  getPergolaForProduct,
  getPergolaPage,
  getPergolaPages,
  getPergolaPagesUsing,
  type PergolaPage,
} from './loaders.server';
export { startFromSku } from './rules';
export type { PergolaContent } from './content';
export type { OtherBuilder } from './components/BiggerSize';

export const PERGOLA_RANGE = 'pergolas';
