export { PergolaProduct } from './components/PergolaProduct';
export { BuilderLinks } from './components/BuilderLinks';
export { PergolaAddOnLinks } from './components/PergolaAddOnLinks';
export {
  getPergolaForProduct,
  getPergolaPage,
  getPergolaPages,
  getPergolaGuides,
  getPergolaPagesUsing,
  type PergolaPage,
} from './loaders.server';
export { startFromQuery, startFromSku } from './rules';
export type { PergolaContent } from './content';
export type { OtherBuilder } from './components/BiggerSize';

export const PERGOLA_RANGE = 'pergolas';
