// BeneficiaryDetailScreen.tsx

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
import {BeneficiaryStackScreenProps} from '@nav/BeneficiaryStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {formatDate, formatPhoneNumber} from '@helpers/formatters';

// types
import {ApiBeneficiary} from '@hooks/useBeneficiaryStore';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

type BeneficiaryDetailScreenProps = NativeStackScreenProps<
  BeneficiaryStackScreenProps,
  'BeneficiaryDetail'
>;

const beneficiaryDetailHeaderRight = ({
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

  useEffect(() => {
    const handleEditPress = () => {
      beneficiary &&
        navigation.navigate('BeneficiaryEdit', {variant: 'edit', beneficiary});
    };
    navigation.setOptions({
      headerRight: () =>
        beneficiaryDetailHeaderRight({
          handleEditPress,
        }),
    });
  }, [beneficiary, navigation]);

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
      <View style={styles.centeredContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {beneficiary && (
          <>
            <List.Section>
              <View
                style={[
                  styles.headerRow,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <View style={styles.col}>
                  <List.Item
                    title={formatDate(new Date(beneficiary.date_of_birth))}
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
                  <Text
                    variant="titleLarge"
                    style={{color: theme.colors.onPrimary}}>
                    {beneficiary.name}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Avatar.Image
                    source={{uri: beneficiary.profile_photo.url}}
                    size={120}
                    style={[
                      styles.thinBorder,
                      {borderColor: theme.colors.outline},
                    ]}
                  />
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
                <FieldThumbnail
                  url={beneficiary.id_front_image.url}
                  theme={theme}
                />
                <FieldThumbnail
                  url={beneficiary.id_back_image.url}
                  theme={theme}
                />
              </View>
              <DetailFieldItem label="Code" value="AA6543" theme={theme} />
              <DetailFieldItem
                label="Phone"
                value={formatPhoneNumber(beneficiary.phone_number)}
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
            <List.Section>
              <DetailFieldItem
                label="Gender"
                value={beneficiary.gender}
                theme={theme}
              />
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
                      variant="labelLarge"
                      style={{color: theme.colors.secondary}}>
                      {beneficiary.guardian}
                    </Text>
                  </Pressable>
                }
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

export default BeneficiaryDetailScreen;

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
    minWidth: '95%',
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
});
