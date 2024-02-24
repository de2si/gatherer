// LandProgressTable.tsx

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {DataTable, HelperText, TextInput, useTheme} from 'react-native-paper';
import {
  ACTIVITY_KEYS,
  ActivityKey,
  Model,
  ProgressItem,
} from '@hooks/carbonSeqHooks';

interface LandProgressTableProps {
  progress: ProgressItem[];
  onEdit: (
    progressItem: ProgressItem | null,
    errorMessage: string | null,
  ) => Promise<void>;
}

const LandProgressTable: React.FC<LandProgressTableProps> = ({
  progress,
  onEdit,
}) => {
  const theme = useTheme();
  const [editable, setEditable] = useState<{
    model: Model;
    col: ActivityKey;
  } | null>(null);
  const [value, setValue] = useState('');

  const handleEdit = async (progressItem: ProgressItem) => {
    if (editable && value) {
      const newValue = parseInt(value, 10);
      const previousIndex = ACTIVITY_KEYS.indexOf(editable.col) - 1;
      const editableColName = editable.col.replace(/total_pits_/g, '');

      if (isNaN(newValue) || newValue < 0) {
        onEdit(null, `${editableColName} value must be a positive number`);
      }

      // Check if the new value is less than or equal to the value of the previous activity key
      else if (
        previousIndex >= 0 &&
        newValue > progressItem[ACTIVITY_KEYS[previousIndex]]
      ) {
        const previousActivityName = ACTIVITY_KEYS[previousIndex].replace(
          /total_pits_/g,
          '',
        );
        await onEdit(
          null,
          `${editableColName} must be less than or equal to ${previousActivityName}.`,
        );
      }

      // Replace the progressItem with the new value
      else {
        await onEdit(
          {
            ...progressItem,
            [editable.col]: newValue,
          },
          null,
        );
      }
    }
    setEditable(null);
    setValue('');
  };

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          {['Model', 'Target', 'Dug', 'Fertilized', 'Planted'].map(
            (colTitle, index) => (
              <DataTable.Title key={index}>{colTitle}</DataTable.Title>
            ),
          )}
        </DataTable.Header>
        {progress.map(progressItem => (
          <DataTable.Row key={progressItem.id}>
            <DataTable.Title>
              {progressItem.model.replace('MODEL_', '').replace(/_/g, '.')}
            </DataTable.Title>
            {ACTIVITY_KEYS.map(colKey => (
              <DataTable.Cell
                key={colKey}
                onPress={() =>
                  setEditable({model: progressItem.model, col: colKey})
                }>
                {editable &&
                editable.model === progressItem.model &&
                editable.col === colKey ? (
                  <TextInput
                    autoFocus
                    keyboardType="numeric"
                    value={value}
                    onChangeText={setValue}
                    onBlur={() => handleEdit(progressItem)}
                  />
                ) : (
                  progressItem[colKey]
                )}
              </DataTable.Cell>
            ))}
          </DataTable.Row>
        ))}
      </DataTable>
      <HelperText
        type="info"
        padding="none"
        style={[
          {color: theme.colors.tertiary},
          theme.fonts.bodyMedium,
          styles.helperText,
        ]}>
        Tap cells to edit values.
      </HelperText>
    </View>
  );
};

export default LandProgressTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  helperText: {
    marginLeft: 12,
  },
});
