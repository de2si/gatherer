// UserDetailScreen.tsx

import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  Menu,
  Portal,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';
import DetailFieldItem from '@components/DetailFieldItem';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserStackScreenProps} from '@nav/UserStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {formatDate, formatPhoneNumber} from '@helpers/formatters';

// types
import {ApiUserType, useProfileStore} from '@hooks/useProfileStore';
import {UserType} from '@helpers/constants';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';
import {MoreStackScreenProps} from '@nav/MoreStack';

type UserDetailScreenProps =
  | NativeStackScreenProps<UserStackScreenProps, 'UserDetail'>
  | NativeStackScreenProps<MoreStackScreenProps, 'ProfileDetail'>;

const UserDetailHeaderRight = ({
  isActive = true,
  handleStatusChange = () => {},
  handleEditPress,
  menuVisible,
  handleMenuVisibility,
  handlePasswordChange,
  routeName,
}: {
  isActive: boolean;
  handleStatusChange: () => void;
  handleEditPress: () => void;
  menuVisible: boolean;
  handleMenuVisibility: (show: boolean) => void;
  handlePasswordChange: () => void;
  routeName: 'UserDetail' | 'ProfileDetail';
}) => {
  return (
    <>
      <Button mode="contained-tonal" onPress={handleEditPress}>
        Edit
      </Button>
      <Menu
        visible={menuVisible}
        onDismiss={() => handleMenuVisibility(false)}
        anchorPosition="bottom"
        anchor={
          <IconButton
            icon="dots-vertical"
            size={24}
            onPress={() => handleMenuVisibility(true)}
          />
        }>
        <Menu.Item onPress={handlePasswordChange} title="Change password" />
        {routeName === 'UserDetail' && (
          <Menu.Item
            onPress={handleStatusChange}
            title={isActive ? 'Deactivate user' : 'Activate user'}
          />
        )}
      </Menu>
    </>
  );
};

const UserDetailScreen: React.FC<UserDetailScreenProps> = ({
  route: {params, name: routeName},
  navigation,
}) => {
  const theme = useTheme();
  let propUser = 'user' in params ? params.user : undefined;
  const userType = 'userType' in params ? params.userType : UserType.ADMIN;
  const profileUser = useProfileStore(store => store.apiData);
  if (routeName === 'ProfileDetail') {
    propUser = profileUser;
  }
  const id = 'id' in params ? params.id : profileUser.id;
  const withAuth = useAuthStore(store => store.withAuth);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [user, setUser] = useState<ApiUserType>();
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('User detail error');
  const locationCodesSet = new Set<number>();
  const blocks: string[] = [];
  const districts: string[] = [];
  const states: string[] = [];
  const projects: string[] = Object.values(user?.projects ?? {}).map(
    project => project.name,
  );
  Object.values(user?.blocks ?? {}).forEach(block => {
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

  const [menuVisible, setMenuVisible] = useState(false);
  useEffect(() => {
    const handleEditPress = () => {
      if (routeName === 'ProfileDetail') {
        (navigation as any).navigate('ProfileEdit', {});
      } else {
        user &&
          (navigation as any).navigate('UserEdit', {
            variant: 'edit',
            user,
            userType,
          });
      }
    };
    const handlePasswordChange = () => {
      handleMenuVisibility(false);
      if (routeName === 'ProfileDetail') {
        user && (navigation as any).navigate('ProfilePassword', {id: user.id});
      } else {
        user &&
          (navigation as any).navigate('UserPassword', {id: user.id, userType});
      }
    };
    const handleMenuVisibility = (show: boolean) => {
      setMenuVisible(show);
    };
    const handleStatusChange = async () => {
      handleMenuVisibility(false);
      setPageLoading(true);
      try {
        await withAuth(async () => {
          try {
            await api.put(
              `users/${user?.id}/${
                user?.is_active ? 'deactivate' : 'activate'
              }/`,
            );
            setUser(prevUser =>
              prevUser
                ? {
                    ...prevUser,
                    is_active: !prevUser.is_active,
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
        setPageLoading(false);
      }
    };

    navigation.setOptions({
      headerRight: () =>
        UserDetailHeaderRight({
          isActive: user?.is_active ?? false,
          handleStatusChange,
          handleEditPress,
          menuVisible,
          handleMenuVisibility,
          handlePasswordChange,
          routeName,
        }),
    });
  }, [
    user,
    navigation,
    userType,
    menuVisible,
    withAuth,
    showSnackbar,
    routeName,
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      if (propUser) {
        setUser(propUser);
        return;
      }
      setLoading(true);
      try {
        await withAuth(async () => {
          try {
            const response = await api.get(`users/${id}/`);
            if (response.data) {
              setUser(response.data);
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
                'Error in fetching user details',
            );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, propUser]); // intentionally removing showSnackbar from dependencies
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
        {user && (
          <>
            <List.Section
              style={[
                styles.headerRow,
                {backgroundColor: theme.colors.primary},
              ]}>
              <View style={styles.col}>
                <List.Item
                  title={user.name}
                  description={user.user_type}
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
                  label={user.name[0]}
                  size={120}
                  style={[
                    styles.thinBorder,
                    {borderColor: theme.colors.outline},
                  ]}
                />
              </View>
            </List.Section>
            <List.Section>
              <DetailFieldItem label="Email" value={user.email} theme={theme} />
              <DetailFieldItem
                label="Phone"
                value={formatPhoneNumber(user.phone_number)}
                theme={theme}
              />
            </List.Section>
            <Divider />
            <List.Section>
              <DetailFieldItem
                label="Gender"
                value={user.gender}
                theme={theme}
              />
              <DetailFieldItem
                label="Date joined"
                value={formatDate(new Date(user.date_joined))}
                theme={theme}
              />
              <DetailFieldItem
                label="Active"
                value={user.is_active ? 'Yes' : 'No'}
                theme={theme}
              />
            </List.Section>
            <Divider />
            {userType !== UserType.ADMIN && (
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
        <Portal>{pageLoading && <LoadingIndicator />}</Portal>
      </View>
    </ScrollView>
  );
};

export default UserDetailScreen;

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
  imageThumbnail: {
    width: 100,
    height: 100,
  },
  thinBorder: {
    borderWidth: 1,
  },
});
