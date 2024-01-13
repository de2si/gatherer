// FarmerDetailScreen.tsx

import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  List,
  MD3Theme,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FarmerStackScreenProps} from '@nav/FarmerStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage} from '@helpers/formHelpers';
import {formatDate, formatPhoneNumber} from '@helpers/formatters';

// types
import {APiFarmer} from '@hooks/useFarmerStore';

// hooks
import useSnackbar from '@hooks/useSnackbar';

type FarmerDetailScreenProps = NativeStackScreenProps<
  FarmerStackScreenProps,
  'FarmerDetail'
>;

const farmerDetailHeaderRight = ({
  handleEditPress,
}: {
  handleEditPress: () => void;
}) => {
  return (
    <>
      <Button mode="contained-tonal" onPress={handleEditPress}>
        Edit
      </Button>
    </>
  );
};

const FieldItem = ({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: MD3Theme;
}) => (
  <View style={styles.row}>
    <Text
      style={[styles.labelText, {color: theme.colors.outline}]}
      variant="labelLarge">
      {label}
    </Text>
    <View style={styles.valueTextContainer}>
      <Text
        variant="labelLarge"
        style={[{color: theme.colors.onSurfaceVariant}]}>
        {value}
      </Text>
    </View>
  </View>
);

const FieldThumbnail = ({url, theme}: {url: string; theme: MD3Theme}) => (
  <Image
    source={{uri: url}}
    style={[styles.imageThumbnail, {borderColor: theme.colors.outline}]}
  />
);

const FarmerDetailScreen: React.FC<FarmerDetailScreenProps> = ({
  route: {
    params: {id},
  },
  navigation,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [farmer, setFarmer] = useState<APiFarmer>();
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Farmer detail error');

  useEffect(() => {
    const handleEditPress = () => {
      farmer && navigation.navigate('FarmerEdit', {variant: 'edit', farmer});
    };
    navigation.setOptions({
      headerRight: () =>
        farmerDetailHeaderRight({
          handleEditPress,
        }),
    });
  }, [farmer, navigation]);

  useEffect(() => {
    const fetchFarmer = async () => {
      setLoading(true);
      try {
        const response = await api.get(`farmers/${id}/`);
        if (response.data) {
          setFarmer(response.data);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        typeof errorMessage === 'string'
          ? showSnackbar(errorMessage)
          : showSnackbar('Error in fetching farmer details');
      } finally {
        setLoading(false);
      }
    };
    fetchFarmer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // intentionally removing showSnackbar from dependencies
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        {farmer && (
          <>
            <List.Section>
              <List.Subheader>Basic</List.Subheader>
              <View style={styles.headerRow}>
                <View style={styles.col}>
                  <List.Item
                    title={farmer.guardian_name}
                    description="Father/Spouse"
                    titleStyle={[
                      theme.fonts.titleMedium,
                      {color: theme.colors.onSurfaceVariant},
                    ]}
                    descriptionStyle={[
                      theme.fonts.labelLarge,
                      {color: theme.colors.outline},
                    ]}
                  />
                  <List.Item
                    title={formatDate(new Date(farmer.date_of_birth))}
                    description="Date of birth"
                    titleStyle={[
                      theme.fonts.titleMedium,
                      {color: theme.colors.onSurfaceVariant},
                    ]}
                    descriptionStyle={[
                      theme.fonts.labelLarge,
                      {color: theme.colors.outline},
                    ]}
                  />
                </View>
                <View style={styles.col}>
                  <Avatar.Image
                    source={{uri: farmer.profile_photo.url}}
                    size={120}
                  />
                  <Text
                    variant="titleLarge"
                    style={{color: theme.colors.onSurface}}>
                    {farmer.name}
                  </Text>
                </View>
              </View>
            </List.Section>
            <Divider />
            <List.Section>
              <List.Subheader>Identification</List.Subheader>
              <View style={styles.row}>
                <Text
                  style={[styles.labelText, {color: theme.colors.outline}]}
                  variant="labelLarge">
                  Aadhaar
                </Text>
                <FieldThumbnail url={farmer.id_front_image.url} theme={theme} />
                <FieldThumbnail url={farmer.id_back_image.url} theme={theme} />
              </View>
              <FieldItem label="Code" value="AA6543" theme={theme} />
              <FieldItem
                label="Phone"
                value={formatPhoneNumber(farmer.phone_number)}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <List.Subheader>Address</List.Subheader>
              <FieldItem
                label="Village"
                value={farmer.village.name}
                theme={theme}
              />
              <FieldItem label="Address" value={farmer.address} theme={theme} />
            </List.Section>
            <Divider />
            <List.Section>
              <List.Subheader>Land</List.Subheader>
              <FieldItem label="Total Land" value="167" theme={theme} />
            </List.Section>
            <Divider />
            <List.Section>
              <List.Subheader>Member</List.Subheader>
            </List.Section>
            <Divider />
            <List.Section>
              <List.Subheader>Others</List.Subheader>
              <FieldItem
                label="Category"
                value={farmer.category}
                theme={theme}
              />
              <FieldItem
                label="Income Level"
                value={farmer.income_level}
                theme={theme}
              />
            </List.Section>
          </>
        )}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={dismissSnackbar}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScrollView>
  );
};

export default FarmerDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  centeredContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  headerRow: {flexDirection: 'row'},
  col: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 12,
  },
  row: {
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
  valueTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 4,
    borderWidth: 1,
  },
});
