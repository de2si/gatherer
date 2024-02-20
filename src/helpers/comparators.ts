import {Filter, FormImage} from '@typedefs/common';

export const areFiltersEqual = (
  filters1: Filter,
  filters2: Filter,
): boolean => {
  const filterKeys1 = Object.keys(filters1);
  const filterKeys2 = Object.keys(filters2);

  // Check if the number of keys is the same
  if (filterKeys1.length !== filterKeys2.length) {
    return false;
  }

  // Check if the values of corresponding keys are equal
  for (const key of filterKeys1 as (keyof Filter)[]) {
    if (!arraysEqual(filters1[key] ?? [], filters2[key] ?? [])) {
      return false;
    }
  }

  return true;
};

// comparator for arrays
export const arraysEqual = <T extends string | number>(
  arr1: T[],
  arr2: T[],
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if the values of all elements are equal
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

// shallow comparator for  objects
export const areObjectsEqual = (
  obj1: Record<string, any>,
  obj2: Record<string, any>,
): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

// dates comparator
export const areDatesEqual = (date1: Date, date2: Date): boolean =>
  date1.getTime() === date2.getTime();

export const arePicturesEqual = (
  arr1: FormImage[] = [],
  arr2: FormImage[] = [],
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].uri !== arr2[i].uri || arr1[i].hash !== arr2[i].hash) {
      return false;
    }
  }

  return true;
};
