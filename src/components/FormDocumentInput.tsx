// FormDocumentInput.tsx

import React from 'react';
import {View} from 'react-native';
import {
  Button,
  HelperText,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import RNFS from 'react-native-fs';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {Control, FieldValues, useController} from 'react-hook-form';
import useSnackbar from '@hooks/useSnackbar';
import {calculateHash} from '@helpers/cryptoHelpers';
import {
  borderStyles,
  commonStyles,
  spacingStyles,
  tableStyles,
} from '@styles/common';

interface FormDocumentInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label?: string;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const allowedFileTypes = [
  // DocumentPicker.types.plainText,
  DocumentPicker.types.pdf,
  // DocumentPicker.types.doc,
  // DocumentPicker.types.docx,
  // 'application/msword',
  // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // 'application/pdf',
];

const FormDocumentInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Document',
  onLayout = () => {},
}: FormDocumentInputProps<TFieldValues>) => {
  const theme = useTheme();
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('');
  const {
    field: {value, onChange},
    fieldState: {error},
  } = useController({
    name,
    control,
  });
  const handleDocumentPick = async () => {
    try {
      const result: DocumentPickerResponse | null =
        await DocumentPicker.pickSingle({
          type: allowedFileTypes,
        });
      if (result) {
        const {uri, type, name: pickedDocName} = result;
        const base64 = (await RNFS.readFile(result.uri, 'base64')) ?? null;
        onChange(
          uri
            ? {uri, type, name: pickedDocName, hash: calculateHash(base64, 256)}
            : null,
        );
        // showSnackbar('Document selected');
      } else {
        onChange(null);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        showSnackbar('Document selection canceled');
      } else {
        showSnackbar('Error in picking document');
      }
    }
  };

  return (
    <View
      onLayout={event => {
        onLayout({name, y: event.nativeEvent.layout.y});
      }}>
      <View style={commonStyles.row}>
        <Text
          style={[
            theme.fonts.bodyLarge,
            {color: theme.colors.outline},
            tableStyles.w120,
            spacingStyles.mr16,
          ]}>
          {label}
        </Text>
        <View style={commonStyles.row}>
          <Button
            icon="file-document"
            onPress={handleDocumentPick}
            buttonColor={theme.colors.primary}
            textColor={
              value ? theme.colors.onPrimary : theme.colors.primaryContainer
            }
            style={[
              borderStyles.radius8,
              error ? borderStyles.border2 : borderStyles.border1,
              {
                borderColor: error ? theme.colors.error : theme.colors.tertiary,
              },
              commonStyles.h40,
              commonStyles.flex1,
            ]}
            contentStyle={tableStyles.flexStart}>
            {value ? value.name : 'Pick document'}
          </Button>
        </View>
      </View>
      <HelperText type="error" visible={error ? true : false}>
        {error?.message ?? (error as any)?.uri?.message ?? 'Error'}
      </HelperText>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={dismissSnackbar}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
};

export default FormDocumentInput;
