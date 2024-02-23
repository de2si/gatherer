// FormDocumentInput.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
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
import {truncateString} from '@helpers/formatters';
import {calculateHash} from '@helpers/cryptoHelpers';

interface FormDocumentInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label?: string;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const allowedFileTypes = [
  DocumentPicker.types.plainText,
  DocumentPicker.types.pdf,
  DocumentPicker.types.doc,
  DocumentPicker.types.docx,
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
        const {uri, name: pickedDocName} = result;
        const base64 = (await RNFS.readFile(result.uri, 'base64')) ?? null;
        onChange(
          uri
            ? {uri: uri, name: pickedDocName, hash: calculateHash(base64, 256)}
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
      <View style={[styles.container, styles.rowContainer]}>
        <Text style={[styles.documentInputLabel, theme.fonts.labelLarge]}>
          {label}
        </Text>
        <View style={styles.colContainer}>
          <View style={[styles.rowContainer, styles.wrap]}>
            <Text style={[theme.fonts.bodyMedium]}>
              {value?.name ? truncateString(value?.name, 35) : ''}
            </Text>
            <Button
              icon="file-document"
              mode="contained-tonal"
              onPress={handleDocumentPick}
              buttonColor={
                error
                  ? theme.colors.errorContainer
                  : theme.colors.tertiaryContainer
              }
              textColor={theme.colors.primary}>
              Pick document
            </Button>
          </View>
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  documentInputLabel: {
    width: 90,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    rowGap: 12,
    columnGap: 12,
  },
  colContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  wrap: {
    flexWrap: 'wrap',
  },
});

export default FormDocumentInput;
