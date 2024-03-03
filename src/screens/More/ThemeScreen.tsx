// ThemeScreen.tsx

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {List, useTheme} from 'react-native-paper';

import {ThemeMode, useSettingStore} from '@hooks/useSettingStore';
import {convertToSentenceCase} from '@helpers/formatters';

//nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MoreStackScreenProps} from '@nav/MoreStack';

//types
type ThemeScreenProps = NativeStackScreenProps<
  MoreStackScreenProps,
  'ThemeSelect'
>;

interface RenderIconProps {
  color?: string;
  size?: number;
}
const renderIcon = (props: RenderIconProps, iconName: string) => (
  <List.Icon {...props} icon={iconName} />
);

const themes: {
  name: ThemeMode;
  icon: string;
  description: string;
}[] = [
  {
    name: 'auto',
    icon: 'brightness-auto',
    description: 'Use system theme',
  },
  {
    name: 'light',
    icon: 'white-balance-sunny',
    description: '',
  },
  {
    name: 'dark',
    icon: 'moon-waning-crescent',
    description: '',
  },
];

const ThemeScreen: React.FC<ThemeScreenProps> = () => {
  const theme = useTheme();
  const selectedTheme = useSettingStore(store => store.theme);
  const setTheme = useSettingStore(store => store.setTheme);
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <List.Section style={styles.list}>
        {themes.map(item => (
          <List.Item
            key={item.name}
            titleStyle={
              selectedTheme === item.name ? {color: theme.colors.primary} : null
            }
            title={convertToSentenceCase(item.name)}
            description={item.description}
            left={props =>
              renderIcon(
                selectedTheme === item.name
                  ? {...props, color: theme.colors.primary}
                  : props,
                item.icon,
              )
            }
            onPress={() => setTheme(item.name)}
          />
        ))}
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    marginTop: 0,
  },
});

export default ThemeScreen;
