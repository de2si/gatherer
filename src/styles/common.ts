import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  sceneContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderTopWidth: 2,
  },
  width100: {
    width: '100%',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pv16: {
    paddingVertical: 16,
  },
});
