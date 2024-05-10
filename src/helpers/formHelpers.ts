import {AxiosError} from 'axios';
import {Filter, FormFile, LV} from '@typedefs/common';
import {AreaUnit} from '@helpers/constants';

// Function to remove specified keys from an object
export const removeKeys = (obj: any, keysToRemove: (string | number)[]) => {
  const newObj = {...obj};
  keysToRemove.forEach((key: string | number) => delete newObj[key]);
  return newObj;
};

// Function to generate nested image object
export const formatToUrlKey = (imageData: FormFile) => ({
  url: imageData.uri,
  hash: imageData.hash,
});

interface NestedErrors {
  [key: string]: string[] | NestedErrors | (NestedErrors | {})[];
}

const flattenNestedErrors = (nestedErrors: NestedErrors): string[] => {
  const flattenedErrors: string[] = [];

  for (const key in nestedErrors) {
    const errorValue = nestedErrors[key];

    if (
      Array.isArray(errorValue) &&
      errorValue.length > 0 &&
      typeof errorValue[0] === 'string'
    ) {
      flattenedErrors.push(`${key}: ${errorValue.join(', ')}`);
    } else if (Array.isArray(errorValue) && errorValue.length > 0) {
      errorValue.forEach((item, _index) => {
        if (typeof item === 'object' && Object.keys(item).length > 0) {
          const nestedErrorsArray = flattenNestedErrors(item as NestedErrors);
          flattenedErrors.push(
            ...nestedErrorsArray.map(nestedError => `${key}: ${nestedError}`),
          );
        }
      });
    } else if (typeof errorValue === 'object' && errorValue !== null) {
      const nestedErrorsArray = flattenNestedErrors(errorValue as NestedErrors);
      flattenedErrors.push(
        ...nestedErrorsArray.map(nestedError => `${key}: ${nestedError}`),
      );
    } else {
      flattenedErrors.push(`${key}: ${String(errorValue)}`);
    }
  }

  return flattenedErrors;
};

export const getErrorMessage = (error: unknown): string | string[] => {
  const isAxiosError = (err: any): err is AxiosError => {
    return err.isAxiosError || (err.response && err.response instanceof Object);
  };

  if (isAxiosError(error)) {
    if (error.response) {
      // For returning field errors if error.response.data is present
      if (error.response.data && typeof error.response.data === 'object') {
        const nestedErrors = flattenNestedErrors(
          error.response.data as NestedErrors,
        );
        return nestedErrors;
      }
      // The request was made, but the server responded with a status code outside the range of 2xx
      const statusCode = error.response.status;
      switch (statusCode) {
        // Bad Request:
        case 400:
          return 'Your request is invalid.';
        // Unauthorized:
        case 401:
          return 'You are not authenticated to access this resource.';
        //Forbidden:
        case 403:
          return 'You do not have permission to access this resource.';
        //Not Found:
        case 404:
          return ' The requested resource was not found.';
        // Add more cases for other status codes as needed
        default:
          return `HTTP Error ${statusCode}: An error occurred on the server.`;
      }
    } else if (error.request) {
      // The request was made, but no response was received
      return 'No response received from the server.';
    } else {
      // Something happened in setting up the request that triggered an Error
      return `Request setup error: ${error.message}`;
    }
  } else {
    return error && typeof error === 'object' && 'message' in error
      ? `${error.message}`
      : 'An unexpected error occurred.';
  }
};

export const getFieldErrors = (
  errorsArray: string[],
): {fieldName: string; fieldErrorMessage: string}[] => {
  return errorsArray.map(line => {
    const [fieldName, ...errorMessageParts] = line
      .split(':')
      .map(str => str.trim());
    const fieldErrorMessage = errorMessageParts.join(':').trim();
    return {fieldName, fieldErrorMessage};
  });
};

// Utility function to check if an error is retryable
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Check for common client or network-related errors
    return (
      error.message.includes('Network Error') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNABORTED') ||
      // Add more conditions
      false
    );
  }
  return false;
};

interface FilterQueryParams {
  states?: string;
  districts?: string;
  blocks?: string;
  villages?: string;
  projects?: string;
}
export const buildFilterQueryParams = (data: Filter): FilterQueryParams => {
  const queryParams: FilterQueryParams = {};

  const order = ['villages', 'blocks', 'districts', 'states'];
  for (const key of order) {
    const codeKey = key.replace(/s$/, 'Codes') as keyof Filter;
    if (data[codeKey]?.length) {
      queryParams[key as keyof FilterQueryParams] = data[codeKey]?.join(',');
      break;
    }
  }

  if (data.projectCodes?.length) {
    queryParams.projects = data.projectCodes.join(',');
  }

  return queryParams;
};

export const transformToLabelValuePair = (
  originalArray: readonly string[],
): LV[] => {
  return originalArray.map(item => ({label: item, value: item}));
};

export const convertToSquareMeters = (
  value: number,
  unit: AreaUnit,
): number => {
  let result: number;
  switch (unit) {
    case AreaUnit.SquareMeters:
      result = value;
      break;
    case AreaUnit.SquareFeet:
      result = value * 0.092903; // 1 square meter = 0.092903 square feet
      break;
    case AreaUnit.Acres:
      result = value * 4046.86; // 1 acre = 4046.86 square meters
      break;
    case AreaUnit.Hectares:
      result = value * 10000; // 1 hectare = 10000 square meters
      break;
    default:
      throw new Error('Invalid area unit');
  }
  return Math.round(result);
};
