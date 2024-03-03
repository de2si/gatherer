// ProfileDetailScreen.tsx

import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  List,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import DetailFieldItem from '@components/DetailFieldItem';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MoreStackScreenProps} from '@nav/MoreStack';

// helpers
import {formatDate, formatPhoneNumber} from '@helpers/formatters';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useProfileStore} from '@hooks/useProfileStore';

// types
import {UserType} from '@helpers/constants';

type ProfileDetailScreenProps = NativeStackScreenProps<
  MoreStackScreenProps,
  'ProfileDetail'
>;

const profileDetailHeaderRight = ({
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

const ProfileDetailScreen: React.FC<ProfileDetailScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const loading = useProfileStore(store => store.loading);
  const profile = useProfileStore(store => store.apiData);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Error');

  const locationCodesSet = new Set<number>();
  const blocks: string[] = [];
  const districts: string[] = [];
  const states: string[] = [];
  const projects: string[] = Object.values(profile?.projects ?? {}).map(
    project => project.name,
  );
  Object.values(profile?.blocks ?? {}).forEach(block => {
    const district = {code: block.district.code, name: block.district.name};
    const state = block.district.state;
    blocks.push(block.name);
    if (!locationCodesSet.has(district.code)) {
      districts.push(district.name);
      locationCodesSet.add(district.code);
    }
    if (!locationCodesSet.has(state.code)) {
      states.push(state.name);
      locationCodesSet.add(state.code);
    }
  });

  useEffect(() => {
    const handleEditPress = () => {
      profile && navigation.navigate('ProfileEdit', {profile});
    };
    navigation.setOptions({
      headerRight: () =>
        profileDetailHeaderRight({
          handleEditPress,
        }),
    });
  }, [navigation, profile]);

  if (!profile) {
    showSnackbar('Error in fetching profile details');
  }
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
        {profile && (
          <>
            <List.Section
              style={[
                styles.headerRow,
                {backgroundColor: theme.colors.primary},
              ]}>
              <View style={styles.col}>
                <List.Item
                  title={profile.name}
                  description={profile.user_type}
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
                <Avatar.Text
                  label={profile.name[0]}
                  size={120}
                  style={[
                    styles.thinBorder,
                    {borderColor: theme.colors.outline},
                  ]}
                />
              </View>
            </List.Section>
            <List.Section>
              <DetailFieldItem
                label="Email"
                value={profile.email}
                theme={theme}
              />
              <DetailFieldItem
                label="Phone"
                value={formatPhoneNumber(profile.phone_number)}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Gender"
                value={profile.gender}
                theme={theme}
              />
              <DetailFieldItem
                label="Date joined"
                value={formatDate(new Date(profile.date_joined))}
                theme={theme}
              />
              <DetailFieldItem
                label="Active"
                value={profile.is_active ? 'Yes' : 'No'}
                theme={theme}
              />
            </List.Section>
            <Divider />
            {profile.user_type !== UserType.ADMIN && (
              <>
                <List.Section>
                  <DetailFieldItem
                    label="States"
                    value={states.join(', ')}
                    theme={theme}
                  />
                  <DetailFieldItem
                    label="Districts"
                    value={districts.join(', ')}
                    theme={theme}
                  />
                  <DetailFieldItem
                    label="Blocks"
                    value={blocks.join(', ')}
                    theme={theme}
                  />
                </List.Section>
                <Divider />
                <List.Section>
                  <DetailFieldItem
                    label="Projects"
                    value={projects.join(', ')}
                    theme={theme}
                  />
                </List.Section>
                <Divider />
              </>
            )}
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

export default ProfileDetailScreen;

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
    marginTop: 0,
  },
  col: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 12,
  },
  thinBorder: {
    borderWidth: 1,
  },
});
