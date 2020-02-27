import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  gnTrpDtl: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,  
    elevation: 2
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6
  },
  label: {
    flex: 1,
    color: 'rgba(0,0,0,.5)'
  },
  value: {
    flex: 2,
    paddingLeft: 10
  },
  tripId: {
    color: '#111',
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row'
  },
  btn: {
    flex: 1
  },
  btnBg: {
    paddingHorizontal: 10,
    paddingVertical: 14
  },
  btnTxt: {
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#fff',
    textAlign: 'center'
  },
  modalBody: {
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  modalLabel: {
    color: 'rgba(0,0,0,.5)',
    marginHorizontal: 20
  },
  modalInput: {
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.05)',
    maxHeight: 360,
    backgroundColor: '#f4f4f4',
    padding: 10
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  },
  modalBtn: {
    margin: 10,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 14,
    flex: 1
  },
  mBtntxt: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalBtnDngr: {
    borderColor: '#cf0921',
    borderWidth: 1
  },
  mBtntxtDanger: {
    color: '#cf0921'
  },
  modalBtnPrimary: {
    backgroundColor: '#3498DB'
  },
  mBtntxtPrimary: {
    color: '#fff'
  },
  reqTitle: {
    marginHorizontal: 16,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#111'
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.05)',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
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
    marginHorizontal: 16,
    fontSize: 14,
    color: '#111',
    fontWeight: 'bold'
  },
  cardTileIcon: {
    fontSize: 16,
    marginLeft: 12
  },
  cardBody: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  cardValueCol: {
    flex: 3,
    marginRight: 10,
    marginBottom: 8
  },
  atchLink: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.05)',
    width: 80,
    height: 52,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  atchImg: {
    width: '100%',
    height: '100%',
  },
  atchImgIcon: {
    fontSize: 28,
  },
  modaCmntlBody: {
    paddingBottom: 20
  },
  modalHeader: {
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: '#111',
    fontWeight: 'bold'
  },
  modalCmntFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 8
  },
  modaCmntlBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    margin: 8
  },
  modaCmntlBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  btnDanger: {
    backgroundColor: 'red'
  },
  btnPrimary: {
    backgroundColor: '#187fe8'
  },
  atchMdlImg: {
    margin: 20,
    width: Dimensions.get('window').width-40,
    height: Dimensions.get('window').width-40,
    alignSelf: 'center'
  },
  atchMdlImgName: {
    color: 'rgba(0,0,0,.65)',
    marginHorizontal: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  atchMdlImgIcon: {
    color: 'rgba(0,0,0,.35)',
    fontSize: 48,
    alignSelf: 'center',
    margin: 20
  },
  endBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  endBtn: {
    flex: 1,
    margin: 8
  },
  endBtnBg: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16
  },
  endBtnTxt: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
});