// ThemeScreen.tsx

import React from 'react';
import {View} from 'react-native';
import {List, useTheme} from 'react-native-paper';

import {ThemeMode, useSettingStore} from '@hooks/useSettingStore';
import {convertToSentenceCase} from '@helpers/formatters';

//nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MoreStackScreenProps} from '@nav/MoreStack';

//types
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
type ThemeScreenProps = NativeStackScreenProps<
  MoreStackScreenProps,
  'ThemeSelect'
>;

// styles
import {commonStyles, fontStyles, spacingStyles} from '@styles/common';

const renderIcon = (
  props: {
    color: string;
    style: Style;
  },
  iconName: string,
  color: string,
) => <List.Icon color={color} icon={iconName} style={props.style} />;

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
    <View style={[commonStyles.flex1, spacingStyles.mh16]}>
      <List.Section>
        {themes.map(item => {
          const itemColor =
            selectedTheme === item.name
              ? theme.colors.primary
              : theme.colors.tertiary;
          return (
            <List.Item
              key={item.name}
              title={convertToSentenceCase(item.name)}
              description={item.description}
              left={props =>
                renderIcon(
                  selectedTheme === item.name
                    ? {...props, color: theme.colors.primary}
                    : props,
                  item.icon,
                  itemColor,
                )
              }
              onPress={() => setTheme(item.name)}
              titleStyle={[{color: itemColor}, fontStyles.bodyXl]}
              descriptionStyle={[{color: itemColor}, theme.fonts.bodyLarge]}
            />
          );
        })}
      </List.Section>
    </View>
  );
};
export default ThemeScreen;
