import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)'
  },
  label: {
    flex: 2,
    fontSize: 14,
    color: 'rgba(0,0,0,.5)',
  },
  value: {
    flex: 3,
    fontSize: 14,
    color: '#111',
    marginLeft: 10
  }
});