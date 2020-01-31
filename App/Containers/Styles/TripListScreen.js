import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#0066b3',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  itemHeaderLeft: {
    paddingRight: 10
  },
  planBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 22
  },
  planBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  headerLabel: {
    color: 'rgba(255,255,255,.65)',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  headerValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold'
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    flexDirection: 'column'
  },
  itemInfo: {
    padding: 16,
    width: '100%'
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
  ftrBtnBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  ftrBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  ftrBtnIcon: {
    color: '#fff',
    marginRight: 16,
    fontSize: 20
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
  },
  viewSvBtn: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.1)',
    width: '100%'
  },
  viewSvBtnText: {
    fontSize: 12,
    color: '#057cf7',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  viewSvBtnIcon: {
    fontSize: 28,
    color: '#057cf7',
    marginLeft: 12,
    marginTop: 3
  }
});