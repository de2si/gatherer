// UserDetailScreen.tsx

import {Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Avatar,
  Divider,
  Icon,
  List,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';
import DetailFieldItem from '@components/DetailFieldItem';
import ImageWrapper from '@components/ImageWrapper';
import {EditIcon} from '@components/icons/EditIcon';
import {ResetPasswordIcon} from '@components/icons/ResetPasswordIcon';
import {DeactivateIcon} from '@components/icons/DeactivateIcon';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserStackScreenProps} from '@nav/UserStack';

// api
import {api} from '@api/axios';

// helpers
import {getErrorMessage, getFieldErrors} from '@helpers/formHelpers';
import {
  convertToSentenceCase,
  formatDate,
  formatPhoneNumber,
} from '@helpers/formatters';

// types
import {ApiUserType, useProfileStore} from '@hooks/useProfileStore';
import {UserType} from '@helpers/constants';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';
import {MoreStackScreenProps} from '@nav/MoreStack';

// styles
import {
  borderStyles,
  commonStyles,
  detailStyles,
  spacingStyles,
} from '@styles/common';

type UserDetailScreenProps =
  | NativeStackScreenProps<UserStackScreenProps, 'UserDetail'>
  | NativeStackScreenProps<MoreStackScreenProps, 'ProfileDetail'>;

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
    if (routeName === 'ProfileDetail') {
      user && (navigation as any).navigate('ProfilePassword', {id: user.id});
    } else {
      user &&
        (navigation as any).navigate('UserPassword', {id: user.id, userType});
    }
  };
  const handleStatusChange = async () => {
    setPageLoading(true);
    try {
      await withAuth(async () => {
        try {
          await api.put(
            `users/${user?.id}/${user?.is_active ? 'deactivate' : 'activate'}/`,
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
      <View style={commonStyles.centeredContainer}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <ScrollView>
      <View
        style={[commonStyles.flex1, spacingStyles.mh16, spacingStyles.mt16]}>
        {user && (
          <>
            <View style={commonStyles.row}>
              {user.profile_photo ? (
                <ImageWrapper
                  flavor="avatar"
                  value={user.profile_photo}
                  size={150}
                  style={[
                    borderStyles.borderMinimal,
                    {borderColor: theme.colors.outline},
                  ]}
                />
              ) : (
                <Avatar.Text
                  label={user.name[0]}
                  size={150}
                  style={[
                    borderStyles.borderMinimal,
                    {borderColor: theme.colors.outline},
                  ]}
                />
              )}
              <View style={detailStyles.colSide}>
                <Text
                  style={[
                    theme.fonts.titleMedium,
                    {color: theme.colors.primary},
                  ]}>
                  User type
                </Text>
                <Text style={theme.fonts.titleLarge}>
                  {convertToSentenceCase(user.user_type)}
                </Text>
                <View
                  style={[
                    commonStyles.rowCentered,
                    detailStyles.colSide,
                    spacingStyles.colGap16,
                    commonStyles.h30,
                  ]}>
                  <Pressable onPress={handleEditPress}>
                    <EditIcon
                      height={16}
                      width={16}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                  <Pressable onPress={handlePasswordChange}>
                    <ResetPasswordIcon
                      height={26}
                      width={20}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                  {routeName === 'UserDetail' && (
                    <Pressable onPress={handleStatusChange}>
                      {user.is_active ? (
                        <DeactivateIcon
                          height={19}
                          width={24}
                          color={theme.colors.primary}
                        />
                      ) : (
                        <View style={spacingStyles.mt8}>
                          <Icon
                            size={24}
                            source={'plus-circle'}
                            color={theme.colors.primary}
                          />
                        </View>
                      )}
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
            <Text
              variant="headlineLarge"
              style={[{color: theme.colors.primary}, spacingStyles.mt12]}>
              {user.name}
            </Text>
            <List.Section>
              <DetailFieldItem label="Email" value={user.email} theme={theme} />
              <DetailFieldItem
                label="Phone"
                value={formatPhoneNumber(user.phone_number)}
                theme={theme}
              />
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
                    label="Projects"
                    value={projects.join(', ')}
                    theme={theme}
                  />
                </List.Section>
                <Divider />
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
              </>
            )}
          </>
        )}
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={dismissSnackbar}
            duration={Snackbar.DURATION_SHORT}>
            {snackbarMessage}
          </Snackbar>
          {pageLoading && <LoadingIndicator />}
        </Portal>
      </View>
    </ScrollView>
  );
};

export default UserDetailScreen;
