type DateFormatVariants = 'DD-MM-YYYY' | 'YYYY-MM-DD';

// Helper function to format date like 'DD-MM-YYYY' or 'YYYY-MM-DD'
export const formatDate = (
  dateToFormat: Date | undefined,
  variant: DateFormatVariants = 'DD-MM-YYYY',
) => {
  if (!dateToFormat) {
    return '';
  }
  const day = dateToFormat.getDate().toString().padStart(2, '0');
  const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
  const year = dateToFormat.getFullYear();
  if (variant === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  return `${day}-${month}-${year}`;
};

export const add91Prefix = (phoneNo: string) => {
  return `+91-${phoneNo}`;
};

export const remove91Prefix = (phoneNo: string) => {
  return phoneNo.replace(/^\+91/, '');
};

export const maskPhoneNumber = (phoneNumber: string) => {
  // Remove the prefix "+91" if present
  const cleanedNumber = phoneNumber.replace(/^\+91/, '');
  // Extract the last 4 digits
  const lastFourDigits = cleanedNumber.slice(-4);
  // Create the masked phone number
  const maskedPhoneNumber = `XXXXXX${lastFourDigits}`;
  return maskedPhoneNumber;
};

export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove any non-digit characters from the phone number
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Check if the phone number starts with 0, which indicates a local number
  if (cleanedPhoneNumber.startsWith('0')) {
    // Format local number: 0-XXXXX-XXXXX
    return cleanedPhoneNumber.replace(/(\d{1})(\d{5})(\d{5})/, '0-$2-$3');
  } else {
    // Format international number: +91 XXXXX-XXXXX
    return cleanedPhoneNumber.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2-$3');
  }
};

export const convertToSentenceCase = (input: string) => {
  return input
    .toLowerCase()
    .replace(/^(.)|\s+(.)/g, match => match.toUpperCase());
};
