import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	item: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16
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
    flex: 1,
    color: 'rgba(0,0,0,.5)',
    paddingRight: 8,
    fontSize: 14
  },
  itemValue: {
    flex: 1,
    color: '#2b3f4e',
    fontSize: 14
  },
  itemActions: {
    paddingVertical: 10,
    paddingRight: 16
  },
  actionBtn: {
    width: 42,
    height: 42
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
  reqIcon: {
    fontSize: 15
  },
  attachBlock: {
    paddingTop: 0
  },
  attachTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#aaa',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  attachInfo: {
    flex: 1
  },
  attachRow: {
    flexDirection: 'row',
    marginVertical: 4
  },
  attachName: {
    flex: 2,
    fontSize: 13
  },
  attachSize: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13
  }
});