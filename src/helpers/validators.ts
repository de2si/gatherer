import * as Yup from 'yup';

export const isValidSha256 = (value: string) => {
  const sha256Regex = /^[a-fA-F0-9]{64}$/;
  return sha256Regex.test(value);
};

export const isValidMD5 = (value: string) => {
  const md5Regex = /^[a-fA-F0-9]{32}$/;
  return md5Regex.test(value);
};

export const isValidSHA3 = (value: string) => {
  const sha3Regex = /^[a-fA-F0-9]{128}$/;
  return sha3Regex.test(value);
};

export const isUri = (value: string) => {
  try {
    const uri = new URL(value);
    // return uri.protocol === 'http:' || uri.protocol === 'https:';
    return uri ? true : false;
  } catch (error) {
    return false;
  }
};

export const isAdult = (value: Date | string) => {
  const birthDate = new Date(value);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const isAtLeast18 =
    age >= 18 ||
    (age === 17 &&
      currentDate.getMonth() >= birthDate.getMonth() &&
      currentDate.getDate() >= birthDate.getDate());
  return isAtLeast18;
};

export const imageValidator = Yup.object().shape({
  uri: Yup.string()
    .required('Image URI is required')
    .test('is-valid-uri', 'Invalid URI', isUri),
  hash: Yup.string()
    .required('Image hash not calculated')
    .test('is-valid-sha-256', 'Invalid 256 bit hash', isValidSha256),
});

export const nameValidator = Yup.string()
  .required('Name is required')
  .min(2, 'Invalid name')
  .matches(
    /^[A-Za-z\s-]+$/,
    'Invalid name. Only letters, spaces, and hyphens are allowed',
  );
