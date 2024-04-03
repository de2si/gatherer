import React, {useState} from 'react';
import {View, Image, Alert, StyleSheet} from 'react-native';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import axios, {AxiosResponse} from 'axios';
import {api} from '@api/axios';
import {Button, Portal, Text} from 'react-native-paper';
import {AxiosError} from 'axios';

interface S3UploadData {
  url: string;
  fields: {
    [key: string]: string;
  };
}

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [s3UploadData, setS3UploadData] = useState<S3UploadData | null>(null);
  const [s3Error, setS3Error] = useState('');

  // Function to retrieve S3 upload data from the Django backend
  const fetchS3UploadData = async (): Promise<void> => {
    try {
      const response: AxiosResponse<S3UploadData> = await api.get(
        'getS3UploadUrl',
      );
      setS3UploadData(response.data);
    } catch (error) {
      console.error('Error fetching S3 upload data:', error);
    }
  };

  const handleImagePickerAction = async (source: 'camera' | 'gallery') => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.5 as const,
      includeBase64: true,
    };
    let result: ImagePickerResponse;
    if (source === 'camera') {
      result = await launchCamera(options);
    } else {
      result = await launchImageLibrary(options);
    }
    handleImagePickerResponse(result);
  };

  const handleImagePickerResponse = async (response: ImagePickerResponse) => {
    // Ensure S3 upload data is available

    if (!s3UploadData) {
      Alert.alert(
        'Error',
        'S3 upload data not available. Please fetch it first.',
      );
      return;
    }
    console.log(s3UploadData);
    if (response.didCancel) {
      console.log('Image selection canceled');
    } else if (response.errorCode) {
      switch (response.errorCode) {
        case 'camera_unavailable':
          console.log('Camera not available on device');
          break;
        case 'permission':
          console.log('Permission not satisfied');
          break;
        default:
          console.log(
            response.errorMessage
              ? response.errorMessage
              : 'Unknown error occurred',
          );
          break;
      }
    } else if (response.assets) {
      const {uri, base64, type, fileName} = response.assets[0];
      const formData = new FormData();
      Object.entries(s3UploadData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append('file', {
        uri: uri,
        type: type,
        name: fileName,
      });

      // Upload the selected image to the S3 bucket using the obtained S3 data
      try {
        const s3Response: AxiosResponse = await axios.post(
          s3UploadData.url,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Image uploaded to S3:', s3Response);
        setSelectedImage(uri ?? null);
      } catch (error) {
        let err = error as AxiosError;
        setS3Error(
          (err.code ?? '') +
            '\n\n' +
            (err.response?.data ?? '') +
            '\n\n' +
            (err.response?.status ?? ''),
        );
        // console.log('>', JSON.stringify(Object.keys(error)));
        // console.log('> Code: ', JSON.stringify(error.code));
        // console.log('> Message: ', JSON.stringify(error.message));
        // console.log('> Name: ', JSON.stringify(error.name));
        // console.log(
        //   '> Response: ',
        //   JSON.stringify(Object.keys(error.response)),
        // );
        // console.log('> Status: ', JSON.stringify(error.response.status));
        // console.log(
        //   '> Status Text: ',
        //   JSON.stringify(error.response.statusText),
        // );
        // console.log('> Data: ', JSON.stringify(error.response));
        console.error('Error uploading image to S3:', error);
      }
    }
  };

  return (
    <View style={styles.centeredContainer}>
      <View style={[styles.col, styles.container]}>
        <Button onPress={fetchS3UploadData} mode="contained-tonal">
          Fetch S3 Upload Data
        </Button>
        <Button
          onPress={() => handleImagePickerAction('gallery')}
          mode="contained-tonal">
          Upload Gallery Image
        </Button>
      </View>

      <View style={[styles.container, styles.row]}>
        <Text variant="bodyMedium">{s3Error}</Text>
      </View>

      <View style={styles.container}>
        {selectedImage && (
          <Image
            source={{uri: selectedImage}}
            style={{width: 200, height: 200}}
          />
        )}
      </View>
      {/* <Portal>
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'pink', opacity: 0.3},
          ]}
        />
      </Portal> */}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 24,
  },
  row: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 24,
    paddingHorizontal: 32,
    marginVertical: 12,
  },
  labelText: {
    minWidth: 90,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
  },
  thinBorder: {
    borderWidth: 1,
  },
});
