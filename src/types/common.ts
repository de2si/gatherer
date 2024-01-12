export interface ApiImage {
  id: number;
  url: string;
  hash: string;
}

export interface FormImage {
  uri: string;
  hash: string;
}

export interface LocationFilterGroup {
  stateCodes: number[];
  districtCodes: number[];
  blockCodes: number[];
  villageCodes: number[];
}
