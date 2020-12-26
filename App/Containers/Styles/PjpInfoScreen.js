import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  title: {
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.05)',
    flexDirection: 'row',
    alignItems: "center"
  },
  titleText: {
    fontWeight: 'bold',
    margin: 16,
    flex: 1
  },
  modalBtnDngr: {
    borderColor: 'red',
    borderWidth: 1
  },
  redText: {
    color: 'red'
  },
  acrdIcon: {
    fontSize: 24,
    marginRight: 16,
    color: 'rgba(0,0,0,.35)'
  },
  row: {
    flexDirection: 'row',
    marginLeft: 16,
    paddingVertical: 16,
    borderBottomColor: '#c9c9c9',
    borderBottomWidth: 1
  },
  label: {
    paddingRight: 16,
    flex: 4
  },
  value: {
    flex: 5,
    paddingRight: 16
  },
  readonly: {
    color: 'rgba(0,0,0,.5)',
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4813',
    margin: 8,
    flex: 1,
    marginBottom: 16
  },
  addBtn: {
    marginHorizontal: 8
  },
  addBtnBg: {
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  addBtnIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 6
  },
  addBtnText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1
  },  
  noReqMsg: {
    margin: 30,
    color: 'rgba(0,0,0,.35)',
    textAlign: 'center'
  },
  cardItem: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardItemHeader: {
    backgroundColor: '#0066b3',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    paddingVertical: 10,
    paddingTop: 8,
  },
  cardTile: {
    flex: 1,
    paddingHorizontal: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  arrowbtn: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 18,
    marginHorizontal: 8,
  },
  cardBody: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardInfo: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(0,0,0,.5)',
    flex: 4,
    marginRight: 10
  },
  cardValue: {
    flex: 5,
    color: '#111',
    fontSize: 14
  },
  itemActions: {
    paddingVertical: 5,
    paddingRight: 16
  },
  actionBtn: {
    width: 42,
    height: 42,
    marginVertical: 5
  },
  actionBtnIco: {
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'center',
    width: 42
  },
  ftrBtnBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  ftrBtnIcon: {
    color: '#fff',
    marginHorizontal: 8,
    fontSize: 20
  },
  ftrBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 8,
    width: '50%',
    textAlign: 'center'
  },
  estAmntLabel:{
    color: 'rgba(255,255,255,.75)',
    fontSize: 13,
  },
  estAmntValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  modalWraper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,.35)',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: -1
  },
  modalBody: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    width: Dimensions.get('window').width - 32,
    maxHeight: Dimensions.get('window').height - 64
  },
  modalHeader: {
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 16,
    color: '#111'
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 16,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)',
  },
  modalItemActive: {
    backgroundColor: '#ff4813',
  },
  mdlActText: {
    color: '#fff'
  },
  modalItemText: {
    fontSize: 14
  },
  modalItemcarot: {
    color: '#fff',
    fontSize: 24,
    position: 'absolute',
    left: 0
  },
  cardItemIntd: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#03a9f4'
  },
  cardItemIntdBtn: {
    padding: 12,
    backgroundColor: 'red',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  cardItemIntdBtnIco: {
    color: '#fff',
    fontSize: 24
  }
});