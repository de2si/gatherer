// ActivityTable.tsx

import React from 'react';
import {View} from 'react-native';
import {DataTable, Text, useTheme} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityTableRow, MODELS} from '@hooks/carbonSeqHooks';
import {
  borderStyles,
  commonStyles,
  fontStyles,
  spacingStyles,
  tableStyles,
} from '@styles/common';

interface ActivityTableProps {
  data: ActivityTableRow[];
  onPress: (participantId: number) => void;
}

const ActivityTable: React.FC<ActivityTableProps> = ({data, onPress}) => {
  const theme = useTheme();
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([20, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0],
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);
  if (from > to) {
    setPage(0);
  }

  const titleTextStyle = [theme.fonts.bodyLarge, {color: theme.colors.primary}];
  const cellTextStyle = [theme.fonts.bodyLarge, fontStyles.regularText];

  return (
    <View style={commonStyles.flex1}>
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header
            style={[
              borderStyles.verticalMinimal,
              {borderColor: theme.colors.primary},
              spacingStyles.mt2,
            ]}>
            <DataTable.Title
              style={[spacingStyles.pv0, tableStyles.w40]}
              textStyle={titleTextStyle}>
              #
            </DataTable.Title>
            <DataTable.Title
              style={[spacingStyles.pv0, tableStyles.w70]}
              textStyle={titleTextStyle}>
              Land
            </DataTable.Title>
            <DataTable.Title
              style={[spacingStyles.pv0, tableStyles.w90]}
              textStyle={titleTextStyle}>
              Farmer
            </DataTable.Title>
            {['Total', ...MODELS].map(colTitle => (
              <DataTable.Title
                key={colTitle}
                style={[spacingStyles.pv0, tableStyles.w50]}
                textStyle={titleTextStyle}>
                {colTitle.replace('MODEL_', '').replace(/_/g, '.')}
              </DataTable.Title>
            ))}
          </DataTable.Header>
          {data.slice(from, to).map((row, rowIndex) => (
            <DataTable.Row
              key={row.id}
              onPress={() => onPress(row.id)}
              style={[
                {
                  backgroundColor:
                    rowIndex % 2
                      ? theme.colors.elevation.level4
                      : theme.colors.secondaryContainer,
                },
                spacingStyles.mt8,
                spacingStyles.pv16,
                tableStyles.dataRow,
              ]}>
              <DataTable.Cell
                style={[tableStyles.w40, tableStyles.dataRow]}
                textStyle={cellTextStyle}>
                {rowIndex + 1}
              </DataTable.Cell>
              <DataTable.Cell
                style={[tableStyles.w70, tableStyles.dataRow]}
                textStyle={cellTextStyle}>
                {row.landCode}
              </DataTable.Cell>
              <DataTable.Cell style={[tableStyles.w90, tableStyles.dataRow]}>
                <Text style={cellTextStyle}>{row.farmerName}</Text>
              </DataTable.Cell>
              <DataTable.Cell
                style={[tableStyles.w50, tableStyles.dataRow]}
                textStyle={cellTextStyle}>
                {row.total}
              </DataTable.Cell>
              {MODELS.map(colKey => (
                <DataTable.Cell
                  key={row.id + colKey}
                  style={[tableStyles.w50, tableStyles.dataRow]}
                  textStyle={cellTextStyle}>
                  {row[colKey]}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / itemsPerPage)}
            onPageChange={newPage => setPage(newPage)}
            label={`Page ${page + 1}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            selectPageDropdownLabel={'Rows'}
            style={tableStyles.flexStart}
            theme={{
              colors: {
                outline: theme.colors.tertiary,
                onSurface: theme.colors.primary,
              },
              roundness: 2,
            }}
            // showFastPaginationControls
          />
        </DataTable>
      </ScrollView>
    </View>
  );
};

export default ActivityTable;
