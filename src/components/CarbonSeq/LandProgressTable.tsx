// LandProgressTable.tsx

import React, {useState} from 'react';
import {View} from 'react-native';
import {
  DataTable,
  HelperText,
  TextInput,
  TextInputProps,
  useTheme,
} from 'react-native-paper';
import {
  ACTIVITY_KEYS,
  ActivityKey,
  Model,
  ProgressItem,
} from '@hooks/carbonSeqHooks';
import {
  borderStyles,
  commonStyles,
  fontStyles,
  spacingStyles,
  tableStyles,
} from '@styles/common';

interface LandProgressTableProps {
  progress: ProgressItem[];
  onEdit: (
    progressItem: ProgressItem | null,
    errorMessage: string | null,
  ) => Promise<void>;
  editable: boolean;
}

const LandProgressTable: React.FC<LandProgressTableProps> = ({
  editable: allowEdit,
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

  const titleTextStyle = [theme.fonts.bodyLarge, {color: theme.colors.primary}];
  const cellTextStyle = [theme.fonts.bodyLarge, fontStyles.regularText];
  const textInputProps: TextInputProps = {
    autoFocus: true,
    keyboardType: 'numeric',
    mode: 'outlined',
    style: [
      {backgroundColor: theme.colors.primary},
      theme.fonts.bodyLarge,
      fontStyles.regularText,
      commonStyles.h40,
    ],
    outlineStyle: borderStyles.radius8,
    placeholderTextColor: theme.colors.primaryContainer,
    selectionColor: theme.colors.onPrimary,
    textColor: theme.colors.onPrimary,
    cursorColor: theme.colors.onPrimary,
    outlineColor: theme.colors.tertiary,
    activeOutlineColor: theme.colors.onPrimaryContainer,
  };

  return (
    <View style={commonStyles.flex1}>
      <DataTable>
        <DataTable.Header
          style={[
            borderStyles.verticalMinimal,
            {borderColor: theme.colors.primary},
          ]}>
          <DataTable.Title style={spacingStyles.pv0} textStyle={titleTextStyle}>
            Model
          </DataTable.Title>
          {['Target', 'Dug', 'Fertilized', 'Planted'].map((colTitle, index) => (
            <DataTable.Title
              key={index}
              style={[commonStyles.centeredContainer, spacingStyles.pv0]}
              textStyle={titleTextStyle}>
              {colTitle}
            </DataTable.Title>
          ))}
        </DataTable.Header>
        {progress.map((progressItem, rowIndex) => {
          const rowColor =
            rowIndex % 2
              ? theme.colors.elevation.level4
              : theme.colors.secondaryContainer;
          return (
            <DataTable.Row
              key={progressItem.id}
              style={[
                {
                  backgroundColor: rowColor,
                },
                spacingStyles.mt8,
                spacingStyles.pv16,
                tableStyles.dataRow,
              ]}>
              <DataTable.Cell textStyle={cellTextStyle}>
                {progressItem.model.replace('MODEL_', '').replace(/_/g, '.')}
              </DataTable.Cell>
              {ACTIVITY_KEYS.map(colKey => (
                <DataTable.Cell
                  style={commonStyles.centeredContainer}
                  textStyle={cellTextStyle}
                  key={colKey}
                  onPress={() =>
                    setEditable({model: progressItem.model, col: colKey})
                  }
                  rippleColor={rowColor}>
                  {allowEdit &&
                  editable &&
                  editable.model === progressItem.model &&
                  editable.col === colKey ? (
                    <TextInput
                      value={value}
                      onChangeText={setValue}
                      onBlur={() => handleEdit(progressItem)}
                      {...textInputProps}
                    />
                  ) : (
                    progressItem[colKey]
                  )}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          );
        })}
      </DataTable>
      <HelperText
        type="info"
        padding="none"
        style={[
          {color: theme.colors.tertiary},
          theme.fonts.bodyMedium,
          fontStyles.italicText,
          fontStyles.regularText,
        ]}>
        {allowEdit && 'Tap on cells to edit values.'}
      </HelperText>
    </View>
  );
};

export default LandProgressTable;
