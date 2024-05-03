import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  sceneContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderTopWidth: 2,
  },
  flex1: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  width100: {
    width: '100%',
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingHorizontal: 0,
  },
  cardDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSideItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
});

export const spacingStyles = StyleSheet.create({
  pv16: {
    paddingVertical: 16,
  },
  mt48: {
    marginTop: 48,
  },
  mr16: {
    marginRight: 16,
  },
});

export const fontStyles = StyleSheet.create({
  regularText: {
    fontWeight: 'normal',
  },
});

export const logoStyles = StyleSheet.create({
  logoImage: {
    width: 250,
    height: 100,
  },
  gathererText: {
    color: '#0D988C',
    width: 250,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    textAlign: 'center',
  },
});
