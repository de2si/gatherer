// MoreScreen.tsx

import React from 'react';
import {View} from 'react-native';
import {Divider, List, useTheme} from 'react-native-paper';
import packageJson from '../../../package.json';

//nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MoreStackScreenProps} from '@nav/MoreStack';

// stores
import {useAuthStore} from '@hooks/useAuthStore';

// styles
import {commonStyles, fontStyles, spacingStyles} from '@styles/common';

//types
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
type MoreListScreenProps = NativeStackScreenProps<
  MoreStackScreenProps,
  'MoreList'
>;

const renderIcon = (
  props: {
    color: string;
    style: Style;
  },
  iconName: string,
  color: string,
) => <List.Icon color={color} icon={iconName} style={props.style} />;

const MoreScreen: React.FC<MoreListScreenProps> = ({navigation}) => {
  const theme = useTheme();
  let logout = useAuthStore(store => store.logout);

  const headerStyles = [{color: theme.colors.primary}, fontStyles.bodyXl];
  const itemStyles = [{color: theme.colors.tertiary}, fontStyles.bodyXl];
  const iconColor = theme.colors.tertiary;

  return (
    <View style={[commonStyles.flex1, spacingStyles.mh16, spacingStyles.mt16]}>
      <List.Item
        title="Profile"
        left={props => renderIcon(props, 'account-circle-outline', iconColor)}
        onPress={() => navigation.navigate('ProfileDetail', {})}
        titleStyle={itemStyles}
      />

      <Divider />
      <List.Section>
        <List.Subheader style={headerStyles}>Personalization</List.Subheader>
        <List.Item
          title="Theme"
          left={props => renderIcon(props, 'palette-outline', iconColor)}
          onPress={() => navigation.navigate('ThemeSelect', {})}
          titleStyle={itemStyles}
        />
      </List.Section>

      <Divider />
      <List.Section>
        <List.Subheader style={headerStyles}>More</List.Subheader>
        <List.Item
          title={`v${packageJson.version}`}
          left={props => renderIcon(props, 'information-outline', iconColor)}
          titleStyle={itemStyles}
        />
        <List.Item
          title="Logout"
          left={props => renderIcon(props, 'logout-variant', iconColor)}
          onPress={logout}
          titleStyle={itemStyles}
        />
      </List.Section>
    </View>
  );
};

export default MoreScreen;
