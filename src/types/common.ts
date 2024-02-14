export interface ApiImage {
  id: number;
  url: string;
  hash: string;
}

export interface FormImage {
  uri: string;
  hash: string;
}

export interface LocationFilter {
  stateCodes?: number[];
  districtCodes?: number[];
  blockCodes?: number[];
  villageCodes?: number[];
}

export interface Filter extends LocationFilter {
  projectCodes?: number[];
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface LV {
  label: string;
  value: string;
}
