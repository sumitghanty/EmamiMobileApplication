import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,    
  },
  accordionHeader: {
    backgroundColor: '#0066b3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  acrdTitle: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  acrdIcon: {
    fontSize: 22,
    color: 'rgba(255,255,255,.75)',
    marginLeft: 16
  },
  accordionBody: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
  },
  subTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 13,
    color: '#111',
    letterSpacing: 2
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
  },
  lastRow: {
    borderBottomWidth: 0
  },
  label: {
    color: 'rgba(0,0,0,.5)',
    marginRight: 16,
    flex: 1
  },
  value: {
    flex: 1,
    marginRight: 16,
    color: '#111'
  },
  rowLast: {
    borderBottomWidth: 0
  },
  atchFiles: {
    flex: 1,
    marginRight: 16
  },
  atchFile: {
    fontSize: 13,
    marginBottom: 6
  },
  downloadBtnGrd: {
    margin: 16,
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  downloadBtnIcon: {
    color: '#fff',
    fontSize: 20,
    marginRight: 16
  },
  downloadBtnTxt: {
    color: '#fff',
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ftrBtn: {
    flex: 1
  },
  ftrBtnBg: {
    padding: 14
  },
  ftrBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  cardItem: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
    borderRadius: 4,
    marginHorizontal: 16,
    marginTop: 16,
  },
  cardItemHeader: {
    backgroundColor: '#03a9f4',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.05)',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    paddingVertical: 8
  },
  cardTile: {
    flex: 1,
    marginRight: 16,
    marginLeft: 16,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  cardTileIcon: {
    fontSize: 16,
    width: 32,
    textAlign: 'right',
    color: '#fff'
  },
  forwardIcon: {
    fontSize: 28,
    marginRight: 16,
    color: 'rgba(255,255,255,.65)'
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
  }
});