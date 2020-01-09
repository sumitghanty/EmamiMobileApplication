import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 16,
    color: '#111',
    padding: 16,
    fontWeight: 'bold',
  },
  item: {
    marginLeft: 16,
    marginBottom: 16,
    marginRight: 16
  },
  itemHeader: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#f4f4f4',
    justifyContent: 'space-between'
  },
  headerLabel: {
    color: 'rgba(0,0,0,.5)',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: 10
  },
  headerValue: {
    fontSize: 14,
    color: '#2b3f4e',
    fontWeight: 'bold',
    flex: 1
  },  
  statusInitiated: {
    color: '#00b3b3'
  },
  statusSuccess: {
    color: '#00a300'
  },
  statusAwaiting: {
    color: '#ff920a'
  },
  itemBody: {
    paddingRight: 0
  },
  itemInfo: {
    flex: 1,
    paddingRight: 16
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4
  },
  itemLabel: {
    flex: 2,
    color: 'rgba(0,0,0,.35)',
    paddingRight: 8,
    fontSize: 14
  },
  itemValue: {
    flex: 3,
    color: '#2b3f4e',
    fontSize: 14
  },
  itemActions: {
    paddingRight: 16
  },
  searchBar: {
      backgroundColor: '#f4f4f4',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,.05)'
  },
  searchInput: {
      paddingVertical: 0,
      height: 38,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,.15)',
      marginHorizontal: 16,
      marginVertical: 8,
      paddingLeft: 16,
      paddingRight: 42,
      backgroundColor: '#fff',
      borderRadius: 18
  },
  searchClear: {
      position: 'absolute',
      top: 8,
      right: 26
  },
  searchClearIcon: {
      fontSize: 20,
      color: 'rgba(0,0,0,.35)',
      marginTop: 8
  },
  searchIcon: {
      fontSize: 24,
      marginTop: 6
  },
  noData: {
      textAlign: 'center',
      margin: 30,
      color: 'rgba(0,0,0,.5)'
  }
});