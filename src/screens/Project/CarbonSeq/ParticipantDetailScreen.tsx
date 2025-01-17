// ParticipantDetailScreen.tsx

import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Button,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import LandProgressTable from '@components/CarbonSeq/LandProgressTable';
import DownloadPdfBtn from '@components/DownloadPdfBtn';

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

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      await withAuth(async () => {
        try {
          await api.put(
            `/projects/1/${id}/${
              participant?.is_active ? 'conclude' : 'restart'
            }/`,
          );
          setParticipant(prevParticipant =>
            prevParticipant
              ? {
                  ...prevParticipant,
                  is_active: !prevParticipant.is_active,
                }
              : undefined,
          );
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      typeof errorMessage === 'string'
        ? showSnackbar(errorMessage)
        : showSnackbar('Error in changing activation status');
    } finally {
      setLoading(false);
    }
  };

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
                <View style={[commonStyles.row, spacingStyles.colGap16]}>
                  <Text
                    variant="headlineSmall"
                    style={[{color: theme.colors.tertiary}]}>
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
                    }}>
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
                    {participant.is_active ? 'Conclude' : 'Restart'}
                  </Button>
                </View>
              </View>
              <DownloadPdfBtn
                label="Carbon waiver"
                color={theme.colors.tertiary}
                value={participant.carbon_waiver_document}
                onError={showSnackbar}
                onSuccess={showSnackbar}
              />
              <DownloadPdfBtn
                label="Agreement"
                color={theme.colors.tertiary}
                value={participant.agreement_document_type}
                onError={showSnackbar}
                onSuccess={showSnackbar}
              />
              <DownloadPdfBtn
                label="Gram panchayat resolution"
                color={theme.colors.tertiary}
                value={participant.gram_panchayat_resolution}
                onError={showSnackbar}
                onSuccess={showSnackbar}
              />
            </View>
            <View style={spacingStyles.mt16}>
              <LandProgressTable
                editable={participant.is_active}
                progress={participant.progress}
                onEdit={onEdit}
              />
            </View>
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

export default ParticipantDetailScreen;
