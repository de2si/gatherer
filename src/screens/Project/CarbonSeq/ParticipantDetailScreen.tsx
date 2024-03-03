// ParticipantDetailScreen.tsx

import React, {useEffect, useState} from 'react';
import {Linking, Pressable, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Button,
  Divider,
  List,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import DetailFieldItem from '@components/DetailFieldItem';
import LandProgressTable from '@components/CarbonSeq/LandProgressTable';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParticipantStackScreenProps} from '@nav/Project/CarbonSeq/ParticipantStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';

// types
import {ApiParticipant, ProgressItem} from '@hooks/carbonSeqHooks';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

type ParticipantDetailScreenProps = NativeStackScreenProps<
  ParticipantStackScreenProps,
  'ParticipantDetail'
>;

const participantDetailHeaderRight = ({
  isConcluded,
  handleStatusChange,
}: {
  isConcluded: boolean;
  handleStatusChange: () => Promise<void>;
}) => {
  return (
    <>
      <Button mode="contained-tonal" onPress={handleStatusChange}>
        {isConcluded ? 'Restart' : 'Conclude'}
      </Button>
    </>
  );
};

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

  useEffect(() => {
    const handleStatusChange = async () => {};
    navigation.setOptions({
      headerRight: () =>
        participantDetailHeaderRight({isConcluded: false, handleStatusChange}),
    });
  }, [navigation]);

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
      <View style={styles.centeredContainer}>
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
      <View style={styles.container}>
        {participant && (
          <>
            <List.Section>
              <DetailFieldItem
                label="Land"
                value={participant.land_parcel.khasra_number}
                valueComponent={
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
                    <Text
                      variant="labelLarge"
                      style={{color: theme.colors.secondary}}>
                      {participant.land_parcel.khasra_number}
                    </Text>
                  </Pressable>
                }
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Carbon waiver"
                valueComponent={
                  <Pressable
                    onPress={() =>
                      openFile(participant.carbon_waiver_document.url)
                    }>
                    <Text
                      variant="labelLarge"
                      style={{color: theme.colors.secondary}}>
                      Open
                    </Text>
                  </Pressable>
                }
                theme={theme}
              />
              <DetailFieldItem
                label="Agreement"
                valueComponent={
                  <Pressable
                    onPress={() =>
                      openFile(participant.agreement_document_type.url)
                    }>
                    <Text
                      variant="labelLarge"
                      style={{color: theme.colors.secondary}}>
                      Open
                    </Text>
                  </Pressable>
                }
                theme={theme}
              />
              <DetailFieldItem
                label="Gram panchayat resolution"
                valueComponent={
                  <Pressable
                    onPress={() =>
                      openFile(participant.gram_panchayat_resolution.url)
                    }>
                    <Text
                      variant="labelLarge"
                      style={{color: theme.colors.secondary}}>
                      Open
                    </Text>
                  </Pressable>
                }
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <LandProgressTable
                progress={participant.progress}
                onEdit={onEdit}
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

export default ParticipantDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
