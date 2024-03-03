// MoreScreen.tsx

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider, List, useTheme} from 'react-native-paper';

//nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MoreStackScreenProps} from '@nav/MoreStack';

// stores
import {useAuthStore} from '@hooks/useAuthStore';

//types
type MoreListScreenProps = NativeStackScreenProps<
  MoreStackScreenProps,
  'MoreList'
>;

interface RenderIconProps {
  color?: string;
  size?: number;
}
const renderIcon = (props: RenderIconProps, iconName: string) => (
  <List.Icon {...props} icon={iconName} />
);

const MoreScreen: React.FC<MoreListScreenProps> = ({navigation}) => {
  const theme = useTheme();
  let logout = useAuthStore(store => store.logout);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <List.Item
        title="Account"
        left={props => renderIcon(props, 'account-circle-outline')}
        onPress={() => navigation.navigate('ProfileDetail', {})}
      />

      <Divider />
      <List.Section>
        <List.Subheader style={{color: theme.colors.primary}}>
          Personalization
        </List.Subheader>
        <List.Item
          title="Theme"
          left={props => renderIcon(props, 'palette-outline')}
          onPress={() => navigation.navigate('ThemeSelect', {})}
        />
      </List.Section>

      <Divider />
      <List.Section>
        <List.Subheader style={{color: theme.colors.primary}}>
          More
        </List.Subheader>
        <List.Item
          title="About"
          left={props => renderIcon(props, 'information-outline')}
        />
        <List.Item
          title="Logout"
          left={props => renderIcon(props, 'logout-variant')}
          onPress={logout}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MoreScreen;
