// constants.ts

// ubiquitous constants
export const GENDER = ['MALE', 'FEMALE'] as const;

// farmer constants
export const CATEGORY = ['GENERAL', 'OBC', 'SC', 'ST', 'MINORITIES'] as const;
export const INCOME_LEVELS = ['<30k', '30k-50k', '50k-80k', '>80k'] as const;

// user constants
export enum UserType {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  SURVEYOR = 'SURVEYOR',
}

// land constants
export enum Ownership {
  PRIVATE = 'PRIVATE',
  COMMUNITY = 'COMMUNITY',
}
export enum AreaUnit {
  SquareMeters = 'Sq. Meters (m²)',
  SquareFeet = 'Sq. Feet (ft²)',
  Acres = 'Acres',
  Hectares = 'Hectares',
}
