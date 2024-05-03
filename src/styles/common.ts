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
  pv16: {
    paddingVertical: 16,
  },
  mt48: {
    marginTop: 48,
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
