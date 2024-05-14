export interface ApiFile {
  id: number;
  url: string;
  hash: string;
}

export interface FormFile {
  uri: string;
  hash: string;
  type?: string;
  name?: string;
}

export interface UploadedFile {
  url: string;
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
