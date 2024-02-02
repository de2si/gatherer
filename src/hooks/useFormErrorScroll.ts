import {useCallback, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {FieldErrors} from 'react-hook-form';

export const useFormErrorScroll = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const layoutPosY = useRef<Record<string, number>>({});
  const fieldOrder = useRef<string[]>([]);
  const [manualScroll, setManualScroll] = useState(false);

  const handleLayout = ({name, y}: {name: string; y: number}) => {
    layoutPosY.current[name] = y;
    if (!fieldOrder.current.includes(name)) {
      fieldOrder.current.push(name);
    }
  };

  const scrollToFirstError = useCallback((errors: FieldErrors) => {
    for (let fieldName of fieldOrder.current) {
      if (fieldName in errors) {
        scrollViewRef.current?.scrollTo({
          y: layoutPosY.current[fieldName],
          animated: true,
        });
        break;
      }
    }
  }, []);

  return {
    scrollViewRef,
    fieldOrder,
    handleLayout,
    manualScroll,
    setManualScroll,
    scrollToFirstError,
  };
};
