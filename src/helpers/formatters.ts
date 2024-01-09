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
