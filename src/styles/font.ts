import {MD3Type} from 'react-native-paper/lib/typescript/types';

export const fontConfig: Partial<MD3Type> = {
  fontFamily: 'Roboto-Regular',
  fontWeight: 'bold',
};

export const fontCustomVariantsConfig: Record<string, MD3Type> = {
  bodyXl: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 26,
  },
};
