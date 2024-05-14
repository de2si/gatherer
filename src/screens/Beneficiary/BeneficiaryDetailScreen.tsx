// BeneficiaryDetailScreen.tsx

import {Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Divider,
  List,
  MD3Theme,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import DetailFieldItem from '@components/DetailFieldItem';
import ImageWrapper from '@components/ImageWrapper';
import {EditIcon} from '@components/icons/EditIcon';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BeneficiaryStackScreenProps} from '@nav/BeneficiaryStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {
  formatDate,
  formatIdAsCode,
  formatPhoneNumber,
} from '@helpers/formatters';

// types
import {ApiBeneficiary} from '@hooks/useBeneficiaryStore';
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

type BeneficiaryDetailScreenProps = NativeStackScreenProps<
  BeneficiaryStackScreenProps,
  'BeneficiaryDetail'
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

const BeneficiaryDetailScreen: React.FC<BeneficiaryDetailScreenProps> = ({
  route: {
    params: {id, beneficiary: propBeneficiary},
  },
  navigation,
}) => {
  const theme = useTheme();
  const withAuth = useAuthStore(store => store.withAuth);
  const [loading, setLoading] = useState(false);
  const [beneficiary, setBeneficiary] = useState<ApiBeneficiary>();
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Beneficiary detail error');

  const handleEditPress = () => {
    beneficiary &&
      navigation.navigate('BeneficiaryEdit', {variant: 'edit', beneficiary});
  };

  useEffect(() => {
    const fetchBeneficiary = async () => {
      if (propBeneficiary) {
        setBeneficiary(propBeneficiary);
        return;
      }
      setLoading(true);
      try {
        await withAuth(async () => {
          try {
            const response = await api.get(`beneficiaries/${id}/`);
            if (response.data) {
              setBeneficiary(response.data);
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
                'Error in fetching beneficiary details',
            );
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiary();
  }, [id, propBeneficiary, showSnackbar, withAuth]);

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
        {beneficiary && (
          <>
            <View style={commonStyles.row}>
              <ImageWrapper
                flavor="avatar"
                value={beneficiary.profile_photo}
                size={150}
                style={[
                  borderStyles.borderMinimal,
                  {borderColor: theme.colors.outline},
                ]}
              />
              <View style={detailStyles.colSide}>
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
              {beneficiary.name}
            </Text>
            <List.Section>
              <DetailFieldItem
                label="Code"
                value={formatIdAsCode('B', parseInt(beneficiary.guardian, 10))}
                theme={theme}
              />
              <DetailFieldItem
                label="Phone number"
                value={formatPhoneNumber(beneficiary.phone_number)}
                theme={theme}
              />
              <DetailFieldItem
                label="Date of birth"
                value={formatDate(new Date(beneficiary.date_of_birth))}
                theme={theme}
              />
              <DetailFieldItem
                label="Gender"
                value={beneficiary.gender}
                theme={theme}
              />
              <View style={[cardStyles.cardDataRow, spacingStyles.mv12]}>
                <FieldThumbnail
                  value={beneficiary.id_front_image}
                  theme={theme}
                />
                <FieldThumbnail
                  value={beneficiary.id_back_image}
                  theme={theme}
                />
              </View>
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Farmer"
                value={beneficiary.guardian}
                valueComponent={
                  <Pressable
                    onPress={() => {
                      // Navigation too be resolved by parent
                      (navigation as any).navigate('FarmerDetail', {
                        id: beneficiary.guardian,
                      });
                    }}>
                    <Text
                      variant="titleMedium"
                      style={{color: theme.colors.secondary}}>
                      {formatIdAsCode('F', parseInt(beneficiary.guardian, 10))}
                    </Text>
                  </Pressable>
                }
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="State"
                value={beneficiary.village.block.district.state.name}
                theme={theme}
              />
              <DetailFieldItem
                label="District"
                value={beneficiary.village.block.district.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Block"
                value={beneficiary.village.block.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Village"
                value={beneficiary.village.name}
                theme={theme}
              />
              <DetailFieldItem
                label="Address"
                value={beneficiary.address}
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

export default BeneficiaryDetailScreen;
