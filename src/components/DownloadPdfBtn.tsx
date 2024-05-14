import React from 'react';
import {View, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {convertBlobToBase64, useAwsSignedCookies} from '@hooks/useS3';
import {ApiFile} from '@typedefs/common';
import {cardStyles} from '@styles/common';

interface DownloadPdfBtnProps {
  label?: string;
  color: string;
  value: ApiFile;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

// const openPDF = async (filePath: string) => {
//   try {
//     const url = `file:///${filePath}`; // Construct the file URL
//     const supported = await Linking.canOpenURL(url);
//     if (supported) {
//       await Linking.openURL(url);
//     } else {
//       console.log('No app found to open PDF');
//     }
//   } catch (error) {
//     console.log('Error opening PDF. ', error);
//   }
// };

const DownloadPdfBtn = ({
  label = 'File',
  color,
  value,
  onError = () => {},
  onSuccess = () => {},
}: DownloadPdfBtnProps) => {
  const {setCookiesOnUrl} = useAwsSignedCookies();

  const downloadAndOpenPdf = async () => {
    try {
      let pdfUrl = value.url;
      await setCookiesOnUrl(pdfUrl);
      const response = await fetch(pdfUrl);
      const pdfPath = `${
        RNFS.DownloadDirectoryPath
      }/${label}_${Date.now()}.pdf`;
      const blob = await response.blob();
      const base64 = await convertBlobToBase64(blob);
      await RNFS.writeFile(pdfPath, base64, 'base64');
      onSuccess(`${label} downloaded successfully`);
      // openPDF(pdfPath);
    } catch (error) {
      onError('Failed to download PDF. ' + error);
    }
  };

  return (
    <View style={cardStyles.cardDataRow}>
      <Text variant="bodyLarge" style={{color}}>
        {label}
      </Text>
      <Pressable onPress={downloadAndOpenPdf}>
        <Text variant="bodyLarge">Download</Text>
      </Pressable>
    </View>
  );
};

export default DownloadPdfBtn;
