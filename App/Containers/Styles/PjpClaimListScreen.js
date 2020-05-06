import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  content: {
    zIndex: -3
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
  arrowbtn: {
    marginLeft:10,
    fontSize: 18,
    width: 24,
    color: 'rgba(255,255,255,.5)',
    textAlign: 'center'
  },
  itemHeader: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#0066b3',
  },
  headerLabel: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: 10,
    marginVertical: 6
  },
  headerValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1
  },  
  statusInitiated: {
    color: '#00b3b3'
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
  actionBtn: {
    width: 42,
    height: 42,
    marginRight: 16
  },
  actionBtnIco: {
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'center',
    width: 42
  },
  mrgTop: {
    marginTop: 10
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
  fPdfLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#ff5726',
  },
  fPdfLinkIcon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 8
  },
  fPdfLinkText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff'
  }
});