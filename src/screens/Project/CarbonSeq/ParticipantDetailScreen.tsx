// ParticipantDetailScreen.tsx

import React, {useEffect, useState} from 'react';
import {Linking, Pressable, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Button,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import LandProgressTable from '@components/CarbonSeq/LandProgressTable';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParticipantStackScreenProps} from '@nav/Project/CarbonSeq/ParticipantStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {formatIdAsCode} from '@helpers/formatters';

// types
import {ApiParticipant, ProgressItem} from '@hooks/carbonSeqHooks';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

// styles
import {
  borderStyles,
  cardStyles,
  commonStyles,
  detailStyles,
  fontStyles,
  spacingStyles,
  tableStyles,
} from '@styles/common';

type ParticipantDetailScreenProps = NativeStackScreenProps<
  ParticipantStackScreenProps,
  'ParticipantDetail'
>;

const ParticipantDetailScreen: React.FC<ParticipantDetailScreenProps> = ({
  route: {
    params: {id, participant: propParticipant},
  },
  navigation,
}) => {
  const theme = useTheme();
  const withAuth = useAuthStore(store => store.withAuth);
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<ApiParticipant>();
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Participant detail error');

  const isConcluded = false;
  const handleStatusChange = async () => {};

  useEffect(() => {
    const fetchParticipant = async () => {
      setLoading(true);
      try {
        await withAuth(async () => {
          try {
            if (propParticipant) {
              setParticipant(propParticipant);
            } else {
              const response = await api.get(`projects/1/${id}/`);
              if (response.data) {
                setParticipant(response.data);
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
                'Error in fetching participant details',
            );
      } finally {
        setLoading(false);
      }
    };
    fetchParticipant();
  }, [id, propParticipant, showSnackbar, withAuth]);
  if (loading) {
    return (
      <View style={commonStyles.centeredContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const openFile = (fileUrl: string) => {
    Linking.openURL(fileUrl).catch(err =>
      console.error('Error opening file:', err),
    );
  };

  const onEdit = async (
    progressItem: ProgressItem | null,
    errorMessage: string | null,
  ) => {
    if (errorMessage) {
      showSnackbar(errorMessage);
      return;
    }
    if (!progressItem) {
      return;
    }
    try {
      setLoading(true);
      await withAuth(async () => {
        try {
          const result = await api.put(`projects/1/${id}/progress/`, {
            progress: JSON.stringify([progressItem]),
          });
          if (result.status === 200) {
            showSnackbar('Updated successfully');
            if (participant) {
              const progressItemIndex = participant.progress.findIndex(
                item => item.model === result.data.progress[0].model,
              );
              const updatedParticipant = {...participant};
              updatedParticipant.progress[progressItemIndex] =
                result.data.progress[0];
              setParticipant(updatedParticipant);
            }
          }
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      const message = getErrorMessage(error);
      let messageToShow =
        typeof message === 'string'
          ? message
          : getFieldErrors(message)[0]?.fieldErrorMessage ??
            'An unexpected error occurred.';
      showSnackbar(messageToShow);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View
        style={[commonStyles.flex1, spacingStyles.mh16, spacingStyles.mv16]}>
        {participant && (
          <>
            <View style={[spacingStyles.rowGap16, spacingStyles.mb16]}>
              <View style={cardStyles.cardDataRow}>
                <View style={commonStyles.rowCentered}>
                  <Text
                    variant="headlineSmall"
                    style={[
                      {color: theme.colors.tertiary},
                      commonStyles.flex1,
                      tableStyles.dataRow,
                    ]}>
                    Land
                  </Text>
                  <Pressable
                    onPress={() => {
                      // Navigation too be resolved by parent
                      (navigation as any).navigate('Data', {
                        screen: 'Land',
                        params: {
                          screen: 'LandDetail',
                          params: {
                            id: participant.land_parcel.id,
                            land: participant.land_parcel,
                          },
                        },
                      });
                    }}
                    style={[commonStyles.flex1, tableStyles.dataRow]}>
                    <Text variant="headlineSmall">
                      {formatIdAsCode('L', participant.land_parcel.id)}
                    </Text>
                  </Pressable>
                </View>

                <View style={[detailStyles.colSide]}>
                  <Button
                    onPress={handleStatusChange}
                    mode="contained"
                    buttonColor={theme.colors.secondary}
                    labelStyle={fontStyles.bodyXl}
                    style={[borderStyles.radius12]}>
                    {isConcluded ? 'Restart' : 'Conclude'}
                  </Button>
                </View>
              </View>
              <View style={cardStyles.cardDataRow}>
                <Text
                  variant="bodyLarge"
                  style={{color: theme.colors.tertiary}}>
                  Carbon waiver
                </Text>
                <Pressable
                  onPress={() =>
                    openFile(participant.carbon_waiver_document.url)
                  }>
                  <Text variant="bodyLarge">Open</Text>
                </Pressable>
              </View>
              <View style={cardStyles.cardDataRow}>
                <Text
                  variant="bodyLarge"
                  style={{color: theme.colors.tertiary}}>
                  Agreement
                </Text>
                <Pressable
                  onPress={() =>
                    openFile(participant.agreement_document_type.url)
                  }>
                  <Text variant="bodyLarge">Open</Text>
                </Pressable>
              </View>
              <View style={cardStyles.cardDataRow}>
                <Text
                  variant="bodyLarge"
                  style={{color: theme.colors.tertiary}}>
                  Gram panchayat resolution
                </Text>
                <Pressable
                  onPress={() =>
                    openFile(participant.gram_panchayat_resolution.url)
                  }>
                  <Text variant="bodyLarge">Open</Text>
                </Pressable>
              </View>
            </View>
            <View style={spacingStyles.mt16}>
              <LandProgressTable
                progress={participant.progress}
                onEdit={onEdit}
              />
            </View>
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

export default ParticipantDetailScreen;
