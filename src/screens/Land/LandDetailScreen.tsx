// LandDetailScreen.tsx

import {Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Divider,
  List,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import DetailFieldItem from '@components/DetailFieldItem';
import CarouselField from '@components/CarouselField';
import CoordinatesDrawer from '@components/CoordinatesDrawer';
import {EditIcon} from '@components/icons/EditIcon';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LandStackScreenProps} from '@nav/LandStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {AreaUnit, Ownership} from '@helpers/constants';
import {formatNumber} from '@helpers/formatters';

// types
import {ApiLand} from '@hooks/useLandStore';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

// styles
import {commonStyles, detailStyles, spacingStyles} from '@styles/common';

type LandDetailScreenProps = NativeStackScreenProps<
  LandStackScreenProps,
  'LandDetail'
>;

const LandDetailScreen: React.FC<LandDetailScreenProps> = ({
  route: {
    params: {id, land: propLand},
  },
  navigation,
}) => {
  const theme = useTheme();
  const withAuth = useAuthStore(store => store.withAuth);

  const [loading, setLoading] = useState(false);
  const [land, setLand] = useState<ApiLand>();
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Land detail error');

  const handleEditPress = () => {
    land && navigation.navigate('LandEdit', {variant: 'edit', land});
  };

  useEffect(() => {
    const fetchLand = async () => {
      setLoading(true);
      try {
        await withAuth(async () => {
          try {
            if (propLand) {
              setLand(propLand);
            } else {
              const response = await api.get(`land-parcels/${id}/`);
              if (response.data) {
                setLand(response.data);
              }
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
                'Error in fetching land details',
            );
      } finally {
        setLoading(false);
      }
    };
    fetchLand();
  }, [id, propLand, showSnackbar, withAuth]);
  if (loading) {
    return (
      <View style={commonStyles.centeredContainer}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <ScrollView>
      <View
        style={[commonStyles.flex1, spacingStyles.mh16, spacingStyles.mt16]}>
        {land && (
          <>
            <CarouselField value={land.pictures} theme={theme} />
            <View style={detailStyles.colSide}>
              <Pressable style={spacingStyles.mt16} onPress={handleEditPress}>
                <EditIcon height={18} width={18} color={theme.colors.primary} />
              </Pressable>
            </View>
            <List.Section>
              <DetailFieldItem
                label="Ownership"
                value={land.ownership_type}
                theme={theme}
              />
              {land.ownership_type === Ownership.PRIVATE && (
                <DetailFieldItem
                  label="Farmer"
                  value={land.farmer_name}
                  valueComponent={
                    <Pressable
                      onPress={() => {
                        // Navigation too be resolved by parent
                        (navigation as any).navigate('FarmerDetail', {
                          id: land.farmer,
                        });
                      }}>
                      <Text
                        variant="titleMedium"
                        style={{color: theme.colors.secondary}}>
                        {land.farmer_name}
                      </Text>
                    </Pressable>
                  }
                  theme={theme}
                />
              )}
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem label="Code" value="LX9864" theme={theme} />
              <DetailFieldItem
                label="Khasra no."
                value={land.khasra_number}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="State"
                value={land.village.block.district.state.name}
                theme={theme}
              />
              <DetailFieldItem
                label="District"
                value={land.village.block.district.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Block"
                value={land.village.block.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Village"
                value={land.village.name}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Farm workers"
                value={formatNumber(land.farm_workers)}
                theme={theme}
              />
              <DetailFieldItem
                label="Area"
                value={formatNumber(land.area) + ' ' + AreaUnit.SquareMeters}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Geo-trace"
                valueComponent={
                  <CoordinatesDrawer
                    coordinates={JSON.parse(land.geo_trace)}
                    theme={theme}
                  />
                }
                theme={theme}
              />
            </List.Section>
            <Divider />
          </>
        )}
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={dismissSnackbar}
            duration={Snackbar.DURATION_SHORT}>
            {snackbarMessage}
          </Snackbar>
        </Portal>
      </View>
    </ScrollView>
  );
};

export default LandDetailScreen;
