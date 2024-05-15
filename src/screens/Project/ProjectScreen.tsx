// ProjectScreen.tsx

import React, {useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {List, Portal, Snackbar, useTheme} from 'react-native-paper';
import {ProjectIcon} from '@components/icons/ProjectIcon';

// nav
import {ProjectStackScreenProps} from '@nav/ProjectStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// hooks, helpers
import {useProjectStore} from '@hooks/useProjectStore';
import useSnackbar from '@hooks/useSnackbar';
import {getErrorMessage} from '@helpers/formHelpers';

// styles
import {
  cardStyles,
  fontStyles,
  otherStyles,
  spacingStyles,
} from '@styles/common';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

type ProjectScreenProps = NativeStackScreenProps<
  ProjectStackScreenProps,
  'HomeScreen'
>;

const ListLeft: React.FC<{
  isActive: boolean;
  color: string;
  style: Style;
}> = ({isActive, ...props}) => (
  <>
    <ProjectIcon width={42} height={42} {...props} />
    <View
      style={[
        otherStyles.dot,
        isActive ? otherStyles.activeDot : otherStyles.inactiveDot,
      ]}
    />
  </>
);

const ProjectScreen: React.FC<ProjectScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const fetchData = useProjectStore(store => store.fetchData);
  const projects = useProjectStore(store => store.data);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('');
  useEffect(() => {
    const fetchProcessing = async () => {
      try {
        await fetchData();
      } catch (error) {
        let message = getErrorMessage(error);
        typeof message === 'string'
          ? showSnackbar(message)
          : showSnackbar('Error in getting projects');
      }
    };
    fetchProcessing();
  }, [fetchData, showSnackbar]);

  const handlePress = (id: number) => {
    if (id === 1) {
      navigation.navigate('CarbonSeq', {});
    }
  };
  return (
    <View>
      <ScrollView>
        <List.Section style={spacingStyles.mh16}>
          {projects.map(project => (
            <List.Item
              key={project.id}
              title={project.name}
              left={props =>
                ListLeft({
                  ...props,
                  isActive: project.is_active,
                  color: theme.colors.primary,
                })
              }
              onPress={() => handlePress(project.id)}
              titleStyle={[fontStyles.bodyXl, {color: theme.colors.primary}]}
              style={[cardStyles.card, {borderColor: theme.colors.tertiary}]}
            />
          ))}
        </List.Section>
      </ScrollView>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={dismissSnackbar}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
};

export default ProjectScreen;
