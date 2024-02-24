// ProjectScreen.tsx

import React from 'react';
import {StyleSheet, View} from 'react-native';
import CarbonSeqTabs from '@nav/Project/CarbonSeq/CarbonSeqTabs';
import {FormProjectSelectInput} from '@components/FormSelectInputCollection';
import {useForm} from 'react-hook-form';

const ProjectScreen = () => {
  const {control, watch} = useForm<{project: number}>({
    defaultValues: {
      project: 1,
    },
  });
  const project = watch('project');
  return (
    <View style={styles.container}>
      <View style={styles.projectSelect}>
        <FormProjectSelectInput
          name="project"
          control={control}
          variant="single"
          hideErrors={true}
        />
      </View>
      {project === 1 && <CarbonSeqTabs />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projectSelect: {
    marginHorizontal: 24,
    marginVertical: 12,
  },
});

export default ProjectScreen;
