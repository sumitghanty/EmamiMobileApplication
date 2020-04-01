import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  header: {
    backgroundColor: '#0066b3',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
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
  },
  selfLable: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6
  },
  selfValueBlock: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 6
  }
});