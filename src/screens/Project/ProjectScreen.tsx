// ProjectScreen.tsx

import React, {useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {List, useTheme} from 'react-native-paper';
import {ProjectIcon} from '@components/icons/ProjectIcon';

// nav
import {ProjectStackScreenProps} from '@nav/ProjectStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// hooks
import {useProjectStore} from '@hooks/useProjectStore';

// styles
import {cardStyles, fontStyles, spacingStyles} from '@styles/common';

type ProjectScreenProps = NativeStackScreenProps<
  ProjectStackScreenProps,
  'HomeScreen'
>;

const ProjectScreen: React.FC<ProjectScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const fetchData = useProjectStore(store => store.fetchData);
  const projects = useProjectStore(store => store.data);
  useEffect(() => {
    if (!projects.length) {
      fetchData();
    }
  }, [fetchData, projects.length]);

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
                ProjectIcon({
                  width: 42,
                  height: 42,
                  ...props,
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
    </View>
  );
};

export default ProjectScreen;
