// ActivityTable.tsx

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityTableRow, MODELS} from '@hooks/carbonSeqHooks';

interface ActivityTableProps {
  data: ActivityTableRow[];
  onPress: (participantId: number) => void;
}

const ActivityTable: React.FC<ActivityTableProps> = ({data, onPress}) => {
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

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.indexCol}>#</DataTable.Title>
            <DataTable.Title style={styles.landCol}>Land</DataTable.Title>
            <DataTable.Title style={styles.farmerCol}>Farmer</DataTable.Title>
            {['Total', ...MODELS].map(colTitle => (
              <DataTable.Title key={colTitle} style={styles.numberCol}>
                {colTitle.replace('MODEL_', '').replace(/_/g, '.')}
              </DataTable.Title>
            ))}
          </DataTable.Header>
          {data.slice(from, to).map((row, rowIndex) => (
            <DataTable.Row key={row.id} onPress={() => onPress(row.id)}>
              <DataTable.Title style={styles.indexCol}>
                {rowIndex + 1}
              </DataTable.Title>
              <DataTable.Cell style={styles.landCol}>
                {row.landCode}
              </DataTable.Cell>
              <DataTable.Cell style={styles.farmerCol}>
                {row.farmerName}
              </DataTable.Cell>
              <DataTable.Cell style={styles.numberCol}>
                {row.total}
              </DataTable.Cell>
              {MODELS.map(colKey => (
                <DataTable.Cell key={row.id + colKey} style={styles.numberCol}>
                  {row[colKey]}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / itemsPerPage)}
            onPageChange={newPage => setPage(newPage)}
            label={`${from + 1}-${to} of ${data.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </DataTable>
      </ScrollView>
    </View>
  );
};

export default ActivityTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  indexCol: {
    width: 40,
  },
  landCol: {
    width: 70,
  },
  farmerCol: {width: 90},
  numberCol: {width: 50},
});
