// FarmerDetailScreen.tsx

import {Image, Pressable, StyleSheet, View} from 'react-native';
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
import DetailFieldItem from '@components/DetailFieldItem';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FarmerStackScreenProps} from '@nav/FarmerStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {formatDate, formatNumber, formatPhoneNumber} from '@helpers/formatters';
import {AreaUnit} from '@helpers/constants';

// types
import {ApiFarmer} from '@hooks/useFarmerStore';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

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

const FieldThumbnail = ({url, theme}: {url: string; theme: MD3Theme}) => (
  <View
    style={[
      styles.thinBorder,
      {borderColor: theme.colors.outline, borderRadius: theme.roundness},
    ]}>
    <Image source={{uri: url}} style={styles.imageThumbnail} />
  </View>
);

const FarmerDetailScreen: React.FC<FarmerDetailScreenProps> = ({
  route: {
    params: {id, farmer: propFarmer},
  },
  navigation,
}) => {
  const theme = useTheme();
  const withAuth = useAuthStore(store => store.withAuth);
  const [loading, setLoading] = useState(false);
  const [farmer, setFarmer] = useState<ApiFarmer>();
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
      if (propFarmer) {
        setFarmer(propFarmer);
        return;
      }
      setLoading(true);
      try {
        await withAuth(async () => {
          try {
            const response = await api.get(`farmers/${id}/`);
            if (response.data) {
              setFarmer(response.data);
            }
          } catch (error) {
            throw error;
          }
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        typeof errorMessage === 'string'
          ? showSnackbar(errorMessage)
          : showSnackbar(
              getFieldErrors(errorMessage)[0].fieldErrorMessage ??
                'Error in fetching farmer details',
            );
      } finally {
        setLoading(false);
      }
    };
    fetchFarmer();
  }, [id, propFarmer, showSnackbar, withAuth]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const totalArea = farmer?.land_parcels.length
    ? formatNumber(
        farmer?.land_parcels.reduce((accumulator, currentObject) => {
          return accumulator + currentObject.area;
        }, 0),
      ) +
      ' ' +
      AreaUnit.SquareMeters
    : '-';
  return (
    <ScrollView>
      <View style={styles.container}>
        {farmer && (
          <>
            <List.Section>
              <View
                style={[
                  styles.headerRow,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <View style={styles.col}>
                  <List.Item
                    title={farmer.guardian_name}
                    description="Father/Spouse"
                    titleStyle={[
                      theme.fonts.titleMedium,
                      {color: theme.colors.onPrimary},
                    ]}
                    descriptionStyle={[
                      theme.fonts.labelLarge,
                      {color: theme.colors.inverseOnSurface},
                    ]}
                  />
                  <List.Item
                    title={formatDate(new Date(farmer.date_of_birth))}
                    description="Date of birth"
                    titleStyle={[
                      theme.fonts.titleMedium,
                      {color: theme.colors.onPrimary},
                    ]}
                    descriptionStyle={[
                      theme.fonts.labelLarge,
                      {color: theme.colors.inverseOnSurface},
                    ]}
                  />
                </View>
                <View style={styles.col}>
                  <Avatar.Image
                    source={{uri: farmer.profile_photo.url}}
                    size={120}
                    style={[
                      styles.thinBorder,
                      {borderColor: theme.colors.outline},
                    ]}
                  />
                  <Text
                    variant="titleLarge"
                    style={{color: theme.colors.onPrimary}}>
                    {farmer.name}
                  </Text>
                </View>
              </View>
            </List.Section>
            <List.Section>
              <View style={styles.row}>
                <Text
                  style={[styles.labelText, {color: theme.colors.outline}]}
                  variant="labelLarge">
                  Aadhaar
                </Text>
                <FieldThumbnail url={farmer.id_front_image.url} theme={theme} />
                <FieldThumbnail url={farmer.id_back_image.url} theme={theme} />
              </View>
              <DetailFieldItem label="Code" value="AA6543" theme={theme} />
              <DetailFieldItem
                label="Phone"
                value={formatPhoneNumber(farmer.phone_number)}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="State"
                value={farmer.village.block.district.state.name}
                theme={theme}
              />
              <DetailFieldItem
                label="District"
                value={farmer.village.block.district.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Block"
                value={farmer.village.block.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Village"
                value={farmer.village.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Address"
                value={farmer.address}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Gender"
                value={farmer.gender}
                theme={theme}
              />
              <DetailFieldItem
                label="Category"
                value={farmer.category}
                theme={theme}
              />
              <DetailFieldItem
                label="Income Level"
                value={farmer.income_level}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              {farmer.land_parcels.length ? (
                <DetailFieldItem
                  label="Land"
                  valueComponent={
                    <View style={styles.linkRow}>
                      {farmer.land_parcels.map(landItem => (
                        <Pressable
                          key={landItem.id}
                          onPress={() => {
                            // Navigation too be resolved by parent
                            (navigation as any).navigate('LandDetail', {
                              id: landItem.id,
                            });
                          }}>
                          <Text
                            variant="labelLarge"
                            style={{color: theme.colors.secondary}}>
                            LX198{landItem.id}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  }
                  theme={theme}
                />
              ) : (
                <DetailFieldItem label="Land" value={'-'} theme={theme} />
              )}
              <DetailFieldItem
                label="Total Land"
                value={totalArea}
                theme={theme}
              />
            </List.Section>
            <Divider />
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
  imageThumbnail: {
    width: 100,
    height: 100,
  },
  thinBorder: {
    borderWidth: 1,
  },
  linkRow: {
    flexDirection: 'row',
    columnGap: 12,
  },
});
