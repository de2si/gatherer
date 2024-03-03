// ProjectScreen.tsx

import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Card, Text, useTheme} from 'react-native-paper';

// nav
import {ProjectStackScreenProps} from '@nav/ProjectStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// hooks
import {useProjectStore} from '@hooks/useProjectStore';

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
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.cardContainer}>
          {projects.map(project => (
            <Card
              style={[styles.card, {backgroundColor: theme.colors.primary}]}
              elevation={2}
              key={project.id}
              onPress={() => handlePress(project.id)}>
              <Text
                variant="titleMedium"
                style={{color: theme.colors.onPrimary}}>
                {project.name}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    margin: 4,
    padding: 8,
    height: 200,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProjectScreen;
