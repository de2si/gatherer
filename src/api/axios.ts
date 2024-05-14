/**
 * axios.ts
 * Define's app axios instance
 */
import axios, {AxiosInstance} from 'axios';
import {BASE_URL, BASE_URL_ANDROID} from '@env';
import {Platform} from 'react-native';

let apiUrl = BASE_URL;
if (Platform.OS === 'android') {
  apiUrl = BASE_URL_ANDROID;
}
apiUrl = 'http://haritika-org.ap-south-1.elasticbeanstalk.com/';
const api: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers as needed
  },
});

export {api};
