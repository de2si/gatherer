// MoreScreen.tsx

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, List, useTheme} from 'react-native-paper';

// stores
import {useAuthStore} from '@hooks/useAuthStore';

interface RenderIconProps {
  color?: string;
  size?: number;
}
const renderIcon = (props: RenderIconProps, iconName: string) => (
  <List.Icon {...props} icon={iconName} />
);

const MoreScreen = () => {
  const theme = useTheme();
  let logout = useAuthStore(store => store.logout);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <List.Section>
        <List.Item
          title="Manage Account"
          description="Your account details"
          left={props => renderIcon(props, 'square-edit-outline')}
        />
      </List.Section>
      <Button mode="contained-tonal" onPress={logout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: 200,
    alignSelf: 'center',
  },
});

export default MoreScreen;
