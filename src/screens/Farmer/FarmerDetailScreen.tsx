// FarmerDetailScreen.tsx

import {Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Divider,
  List,
  MD3Theme,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import DetailFieldItem from '@components/DetailFieldItem';
import ImageWrapper from '@components/ImageWrapper';
import {EditIcon} from '@components/icons/EditIcon';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FarmerStackScreenProps} from '@nav/FarmerStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {
  formatDate,
  formatIdAsCode,
  formatNumber,
  formatPhoneNumber,
} from '@helpers/formatters';
import {AreaUnit} from '@helpers/constants';

// types
import {ApiFarmer} from '@hooks/useFarmerStore';
import {ApiImage} from '@typedefs/common';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

// styles
import {
  borderStyles,
  cardStyles,
  commonStyles,
  detailStyles,
  spacingStyles,
} from '@styles/common';

type FarmerDetailScreenProps = NativeStackScreenProps<
  FarmerStackScreenProps,
  'FarmerDetail'
>;

const FieldThumbnail = ({value, theme}: {value: ApiImage; theme: MD3Theme}) => (
  <View
    style={[
      borderStyles.borderMinimal,
      {borderColor: theme.colors.outline, borderRadius: theme.roundness},
    ]}>
    <ImageWrapper
      flavor="regular"
      value={value}
      style={detailStyles.imageThumbnail}
    />
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

  const handleEditPress = () => {
    farmer && navigation.navigate('FarmerEdit', {variant: 'edit', farmer});
  };

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
      <View style={commonStyles.centeredContainer}>
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
      '\n' +
      AreaUnit.SquareMeters
    : '-';
  return (
    <ScrollView>
      <View
        style={[commonStyles.flex1, spacingStyles.mh16, spacingStyles.mt16]}>
        {farmer && (
          <>
            <View style={commonStyles.row}>
              <ImageWrapper
                flavor="avatar"
                value={farmer.profile_photo}
                size={150}
                style={[
                  borderStyles.borderMinimal,
                  {borderColor: theme.colors.outline},
                ]}
              />
              <View style={detailStyles.colSide}>
                <Text
                  style={[
                    theme.fonts.titleMedium,
                    {color: theme.colors.primary},
                  ]}>
                  Father/Spouse
                </Text>
                <Text style={theme.fonts.titleLarge}>
                  {farmer.guardian_name}
                </Text>
                <Pressable style={spacingStyles.mt12} onPress={handleEditPress}>
                  <EditIcon
                    height={18}
                    width={18}
                    color={theme.colors.primary}
                  />
                </Pressable>
              </View>
            </View>
            <Text
              variant="headlineLarge"
              style={[{color: theme.colors.primary}, spacingStyles.mt12]}>
              {farmer.name}
            </Text>
            <List.Section>
              <DetailFieldItem
                label="Code"
                value={formatIdAsCode('F', farmer.farmer_id)}
                theme={theme}
              />
              <DetailFieldItem
                label="Phone number"
                value={formatPhoneNumber(farmer.phone_number)}
                theme={theme}
              />
              <DetailFieldItem
                label="Date of birth"
                value={formatDate(new Date(farmer.date_of_birth))}
                theme={theme}
              />
              <DetailFieldItem
                label="Category"
                value={farmer.category}
                theme={theme}
              />
              <DetailFieldItem
                label="Gender"
                value={farmer.gender}
                theme={theme}
              />
              <View style={[cardStyles.cardDataRow, spacingStyles.mv12]}>
                <FieldThumbnail value={farmer.id_front_image} theme={theme} />
                <FieldThumbnail value={farmer.id_back_image} theme={theme} />
              </View>
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Income Level"
                value={farmer.income_level + '/month'}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              {farmer.land_parcels.length ? (
                <DetailFieldItem
                  label="Land"
                  valueComponent={
                    <View style={detailStyles.linkRow}>
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
                            variant="titleMedium"
                            style={{color: theme.colors.secondary}}>
                            {formatIdAsCode('L', landItem.id)}
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
