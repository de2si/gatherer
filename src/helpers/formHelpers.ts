import {AxiosError} from 'axios';

// Function to remove specified keys from an object
export const removeKeys = (obj: any, keysToRemove: (string | number)[]) => {
  const newObj = {...obj};
  keysToRemove.forEach((key: string | number) => delete newObj[key]);
  return newObj;
};

// Function to generate nested image object
export const formatToUrlKey = (imageData: {uri: string; hash: string}) => ({
  url: imageData.uri,
  hash: imageData.hash,
});

interface NestedErrors {
  [key: string]: string[] | NestedErrors;
}

const flattenNestedErrors = (nestedErrors: NestedErrors): string[] => {
  const flattenedErrors: string[] = [];

  for (const key in nestedErrors) {
    const errorValue = nestedErrors[key];

    if (Array.isArray(errorValue)) {
      flattenedErrors.push(`${key}: ${errorValue.join(', ')}`);
    } else if (typeof errorValue === 'object' && errorValue !== null) {
      const nestedErrorsArray = flattenNestedErrors(errorValue as NestedErrors);
      flattenedErrors.push(
        ...nestedErrorsArray.map(nestedError => `${key}-${nestedError}`),
      );
    } else {
      flattenedErrors.push(`${key}: ${String(errorValue)}`);
    }
  }

  return flattenedErrors;
};

export const getErrorMessage = (error: unknown): string => {
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
        return nestedErrors.join('\n');
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
    return 'An unexpected error occurred.';
  }
};

export interface LocationFilterGroup {
  stateCodes: number[];
  districtCodes: number[];
  blockCodes: number[];
  villageCodes: number[];
}
interface LocationQueryParams {
  states?: string;
  districts?: string;
  blocks?: string;
  villages?: string;
}
export const buildLocationFilterQueryParams = (data: LocationFilterGroup) => {
  const queryParams: LocationQueryParams = {};

  for (const codeType of [
    'villageCodes',
    'blockCodes',
    'districtCodes',
    'stateCodes',
  ] as (keyof LocationFilterGroup)[]) {
    if (data[codeType]?.length) {
      queryParams[codeType.replace(/Code/, '') as keyof LocationQueryParams] =
        data[codeType].join(',');
      break;
    }
  }
  return queryParams;
};