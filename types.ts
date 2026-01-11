
export enum RecipeStep {
  SEARCHING = 'SEARCHING',
  INTRO = 'INTRO',
  MELT_BUTTER = 'MELT_BUTTER',
  FRY_KADAIF = 'FRY_KADAIF',
  MIX_PISTACHIO = 'MIX_PISTACHIO',
  SHAPE_BALLS = 'SHAPE_BALLS',
  MELT_MARSHMALLOW = 'MELT_MARSHMALLOW',
  ADD_SEASONING = 'ADD_SEASONING',
  FINISHED = 'FINISHED',
  PACKAGING = 'PACKAGING',
  MESSAGE = 'MESSAGE',
  FINAL = 'FINAL'
}

export interface CookieConfig {
  toppings: string[];
  seasoning: string;
  message: string;
}

export const TOPPING_OPTIONS = [
  '아몬드 슬라이스',
  '피칸',
  '초코칩',
  '프레첼',
  '시리얼',
  '호두',
  '건조 베리'
];

export const SEASONING_OPTIONS = [
  { name: '코코아 파우더', value: 'Cocoa Powder', color: 'bg-amber-900' },
  { name: '말차 파우더', value: 'Matcha Powder', color: 'bg-green-700' },
  { name: '고춧가루', value: 'Chili Powder', color: 'bg-red-600' },
  { name: '시나몬 파우더', value: 'Cinnamon Powder', color: 'bg-orange-800' },
  { name: '슈가 파우더', value: 'Sugar Powder', color: 'bg-stone-100' }
];
