// useS3.ts

import {api} from '@api/axios';
import {useAuthStore} from '@hooks/useAuthStore';

// helpers
import {
  getErrorMessage,
  getFieldErrors,
  // removeKeys,
} from '@helpers/formHelpers';
import {ApiFile, FormFile, UploadedFile} from '@typedefs/common';
import axios, {AxiosResponse} from 'axios';
import {useCallback, useEffect, useState} from 'react';
// import {create} from 'zustand';
// import {createJSONStorage, persist} from 'zustand/middleware';
// import {calculateHash} from '@helpers/cryptoHelpers';
// import RNFS from 'react-native-fs';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';

// Type Definitions
interface ApiS3Upload {
  resource_url: string;
  url: string;
  fields: {
    [key: string]: string;
  };
}

export type FilesObj = {
  [key: string]: FormFile | undefined;
};

interface UseS3Upload {
  upload: (files: FilesObj) => Promise<{[key: string]: UploadedFile}>;
}

// Create the hook for farmer search
export const useS3Upload = (): UseS3Upload => {
  const withAuth = useAuthStore(store => store.withAuth);
  const upload = async (
    files: FilesObj,
  ): Promise<{[key: string]: UploadedFile}> => {
    let output = {};
    await withAuth(async () => {
      try {
        const uploadPromises = Object.entries(files).map(
          async ([key, file]) => {
            // Handle undefined or null files if needed
            if (!file) {
              return [key, undefined];
            }

            const fileToUpload = {
              uri: file.uri,
              type: file.type ?? '',
              name: file.name ?? '',
            };

            const response: AxiosResponse<ApiS3Upload> = await api.get(
              'getS3UploadUrl',
            );

            const formData = new FormData();
            Object.entries(response.data.fields).forEach(
              ([fieldKey, value]) => {
                formData.append(fieldKey, value);
              },
            );
            formData.append('file', fileToUpload);

            await axios.post(response.data.url, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            // const bucket =
            // response.data.url.match(/\/\/([^.]+)\./)?.[1] ?? 'haritika-org';
            // const pathString = `s3://${bucket}/${response.data.fields.key}`;

            return [key, {url: response.data.resource_url, hash: file.hash}];
          },
        );

        const result = await Promise.all(uploadPromises);
        output = Object.fromEntries(
          result.filter(entry => entry[1] !== undefined),
        );
      } catch (error) {
        let message = getErrorMessage(error);
        let messageToShow =
          typeof message === 'string'
            ? message
            : getFieldErrors(message)[0]?.fieldErrorMessage ??
              'An unexpected error occurred when uploading image';
        throw new Error(messageToShow);
      }
    });
    return output;
  };
  return {upload};
};

// interface FileIndexStore {
//   localFileIndex: Record<number, string>;
//   updateIndex: (id: number, url: string) => void;
//   deleteIndex: (id: number) => void;
// }
// const useFileIndexStore = create(
//   persist<FileIndexStore>(
//     set => ({
//       localFileIndex: {},
//       updateIndex: (id, url) =>
//         set(state => ({localFileIndex: {...state.localFileIndex, [id]: url}})),
//       deleteIndex: id => set(state => removeKeys(state.localFileIndex, [id])),
//     }),
//     {name: 'MJKQp5GHGV1etw', storage: createJSONStorage(() => AsyncStorage)},
//   ),
// );

// Function to convert Blob to base64
export const convertBlobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1]; // Extract the base64 data part
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert Blob to base64.'));
      }
    };
    reader.readAsDataURL(blob);
  });
};

// Set the received cookies
const setCookies = async (
  url: string,
  awsSignedCookies: {[key: string]: string},
) => {
  if (!url.includes('cloudfront.net')) {
    return;
  }
  try {
    for (const [key, value] of Object.entries(awsSignedCookies)) {
      await CookieManager.set(url, {name: key, value: value});
    }
  } catch (error) {
    throw new Error('Unable to set cookies');
  }
};

interface UseS3Cookies {
  setCookiesOnUrl: (url: string) => Promise<void>;
}

export const useAwsSignedCookies = (): UseS3Cookies => {
  const [awsSignedCookies, setAwsSignedCookies] = useState<{
    [key: string]: string;
  }>({});
  const [lastFetchedTime, setLastFetchedTime] = useState(0);
  const withAuth = useAuthStore(store => store.withAuth);

  const fetchCookiesIfNeeded = async () => {
    // Check if cookies are available and fetched within 5 minutes
    if (!awsSignedCookies || Date.now() - lastFetchedTime > 5 * 60 * 1000) {
      try {
        await withAuth(async () => {
          try {
            const {data} = await api.get('getAwsSignedCookies');
            setAwsSignedCookies(data.awsSignedCookies);
            setLastFetchedTime(Date.now());
          } catch (err) {
            throw err;
          }
        });
      } catch (err) {
        throw err;
      }
    }
  };

  const setCookiesOnUrl = async (url: string) => {
    await fetchCookiesIfNeeded();
    if (awsSignedCookies) {
      await setCookies(url, awsSignedCookies);
    } else {
      throw new Error('Error setting AWS signed cookies');
    }
  };

  return {setCookiesOnUrl};
};

interface UseS3Download {
  localUrl: string;
  error: string | null;
}
export const useS3Download = (file: ApiFile): UseS3Download => {
  const [localUrl, setLocalUrl] = useState('file://pseudo');
  const [error, setError] = useState<null | string>(null);
  // const localFileIndex = useFileIndexStore(store => store.localFileIndex);
  // const updateIndex = useFileIndexStore(store => store.updateIndex);
  const {setCookiesOnUrl} = useAwsSignedCookies();

  const download = useCallback(async () => {
    if (file.url.startsWith('file://')) {
      setLocalUrl(file.url);
      return;
    }
    // if (file.id in localFileIndex) {
    //   setLocalUrl(localFileIndex[file.id]);
    //   return;
    // }
    try {
      await setCookiesOnUrl(file.url);
      setLocalUrl(file.url);

      // Download the image and update the store
      // const response = await fetch(file.url);
      // const blob = await response.blob();
      // const base64 = await convertBlobToBase64(blob);
      // const calculatedHash = calculateHash(base64, 256);

      // if (file.hash === calculatedHash) {
      // const localImageUrl = `file:///data/user/0/com.gatherer/cache/s3_${file.id}.png`;
      // updateIndex(file.id, file.url);
      // setLocalUrl(file.url);
      // await RNFS.writeFile(localImageUrl, base64, 'base64');
      // setLocalUrl(localImageUrl);
      // } else {
      // throw new Error('Hash failed to match');
      // }
    } catch (err) {
      let message = getErrorMessage(err);
      let finalMessage =
        typeof message === 'string'
          ? message
          : getFieldErrors(message)[0]?.fieldErrorMessage ??
            'An unexpected error occurred when uploading image';
      setError(finalMessage);
    }
  }, [file.url, setCookiesOnUrl]);

  useEffect(() => {
    download();
  }, [download]);
  return {localUrl, error};
};
