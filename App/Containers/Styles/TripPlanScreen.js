import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  content: {
    paddingBottom: 30
  },
  formLabel: {
    flex: 1,
    paddingRight: 10,
    fontSize: 16,
    color: 'rgba(0,0,0,.5)',
    marginTop: 16,
    marginBottom: 16
  },
  formInput: {
    flex: 1,
    paddingRight: 16,
    color: 'rgba(0,0,0,.5)',
    fontSize: 14
  },
  modalWraper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
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
    paddingBottom: 30
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 16,
    color: 'rgba(0,0,0,.5)'
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  modalItemActive: {
    backgroundColor: '#ff4813',
  },
  modalItemIconHolder: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalItemIcon: {
    color: '#fff',
    fontSize: 18
  },
  mdlActIcon: {
    color: '#ff4813'
  },
  mdlActText: {
    color: '#fff'
  },
  modalItemBody: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)',
    minHeight: 44,
    paddingVertical: 6,
    flexDirection: 'column',
    justifyContent: 'center'
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
  accordionHeader: {
    backgroundColor: '#0B5FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  acrdTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  acrdIcon: {
    fontSize: 18,
    color: 'rgba(255,255,255,.75)',
    marginLeft: 16
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  datePickerIcon: {
    color: 'rgba(0,0,0,.5)',
    marginHorizontal: 10
  },
  datePickerLabel: {
    flex: 1
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  titleText: {
    fontSize: 14,
    color: '#111',
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16
  },
  addBtnBg: {
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  addBtnIcon: {
    color: '#fff',
    fontSize: 18,
    marginRight: 8,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff'
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
    marginVertical: 8,
  },
  cardItemHeader: {
    backgroundColor: '#f8f8f8',
    borderBottomColor: 'rgba(0,0,0,.05)',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 3,
    minHeight: 46
  },
  checkBox: {
    width: 46,
    height: 46,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 3
  },
  checkedBox: {
    backgroundColor: '#1abc9c',
  },
  unCheckedBox: {
    backgroundColor: 'rgba(0,0,0,.05)',
  },
  uncheckIcon: {
    fontSize: 20,
    color: 'rgba(0,0,0,.5)'
  },
  checkIcon: {
    fontSize: 24,
    color: '#fff'
  },
  cardTile: {
    flex: 1,
    marginLeft: 16,
    marginRight: 10,
    fontSize: 13,
    color: '#111',
    fontWeight: 'bold'
  },
  cardTileIcon: {
    fontSize: 16,
    marginLeft: 12
  },
  editlBtn: {
    borderTopRightRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#347eff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46
  },
  editBtnIcon: {
    fontSize: 18,
    color: '#fff',
  },
  editBtnText: {
    fontSize: 11,
    color: '#fff'
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
    flex: 2,
    marginRight: 10
  },
  cardValue: {
    flex: 3,
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
  footer: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.05)',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  ftrBtnR: {
    flex: 1
  },
  ftrBtnBgR: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center'
  },
  ftrBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,.05)',
    padding: 8
  },
  ftrBtnIcon: {
    fontSize: 24,
    opacity: .85
  },
  ftrBtnText: {
    fontSize: 12
  },
  ftrBtnIconR: {
    color: '#fff',
    fontSize: 24,
    marginRight: 8
  },
  ftrBtnTxtR: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  textPrimary: {
    color: '#217aff'
  },
  textWarning: {
    color: '#e07c00'
  },
  textSuccess: {
    color: '#25a92f'
  },
  cardValueBtn: {
    flex: 3,
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    backgroundColor: '#f8f8f8',
    marginBottom: 6
  },
  cardValueBtnText: {
    color: '#111',
    flex: 1,
    fontSize: 13
  },
  noReqMsg: {
    margin: 30,
    color: 'rgba(0,0,0,.35)',
    textAlign: 'center'
  },
  cardHrzntl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
    height: 46
  },
  cardHrzntlBtnLeft: {
    height: 46,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 0
  },
  cardHrzntlBtnRight: {
    borderBottomRightRadius: 4
  }
});