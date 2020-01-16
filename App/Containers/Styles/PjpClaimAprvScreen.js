import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  accordionHeader: {
    backgroundColor: '#0066b3',
    borderBottomColor: 'rgba(0,0,0,.1)',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  acrdTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  acrdIcon: {
    fontSize: 18,
    color: 'rgba(255,255,255,.65)',
    marginLeft: 16
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)'
  },
  itemLabel: {
    flex: 2,
    paddingRight: 10,
    fontSize: 14,
    color: 'rgba(0,0,0,.5)',
    marginTop: 6,
    marginBottom: 6
  },
  itemValue: {
    flex: 3,
    paddingRight: 16,
    color: '#111',
    fontSize: 14
  },
  titleRow: {
    backgroundColor: '#0066b3',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16
  },
  title: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1
  },
  subTitle: {
    color: 'rgba(0,0,0,.35)',
    fontWeight: 'bold',
    letterSpacing: 1,
    margin: 16
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
    paddingBottom: 10
  },
  cardItemHeader: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)'
  },
  cardItemHeaderCol: {
    width: Dimensions.get('window').width/2 - 57,
    padding: 8
  },
  cardHdrLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'rgba(0,0,0,.35)'
  },
  cardHdrValue: {
    fontSize: 14,
    color: '#111'
  },
  hdrIcon: {
    fontSize: 24,
    color: 'rgba(0,0,0,.35)',
    width: 32,
    textAlign: 'center',
    alignSelf: 'center'
  },
  cmntBtn: {
    width: 42,
    height: 52,
    borderTopRightRadius: 4,
    backgroundColor: '#f4f4f4',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cmntIcon: {
    fontSize: 28,
    color: '#0b9aff'
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 5
  },
  cardLabel: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
    color: 'rgba(0,0,0,.5)'
  },
  reqAmnt: {
    fontWeight: 'bold',
  },
  cardValue: {
    flex: 1,
    color: '#111',
    fontSize: 14,
    marginHorizontal: 8
  },
  cardValueCol: {
    flex: 1,
    marginHorizontal: 8
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
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.05)',
    maxHeight: 360,
    backgroundColor: '#f4f4f4',
    padding: 10
  },
  modalFooter: {
    marginTop: 20,
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
  modalAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.15)'
  },
  modalAcrdTitle: {
    color: '#111',
    fontSize: 14,
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 10
  },
  modalAcrdIcon: {
    fontSize: 23,
    color: 'rgba(0,0,0,.35)',
    marginRight: 12
  },
  modalAcrdBody: {
    marginHorizontal: 16,
    padding: 12,
    borderColor: 'rgba(0,0,0,.15)',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  modalAcrdComents: {
    color: 'rgba(0,0,0,.5)'
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
  modalCmntLabel: {
    marginHorizontal: 16,
    marginTop: 20,
    fontSize: 16,
    color: '#111'
  },
  cmntInput: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 0
  },
  errorMsg: {
    fontSize: 12,
    color: 'red',
    marginHorizontal: 20
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
  totalTable: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
  },
  totalTableHeader: {
    backgroundColor: '#1395f7',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  totalTableTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff'
  },
  totalTableRow: {
    flexDirection: 'row',    
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.1)',
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  totalTableLabel: {
    flex: 3,
    marginRight: 10
  },
  totalTableValue: {
    flex: 2,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  textRight: {
    textAlign: 'right',
    flex: 2
  },
  selfLabel: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6
  },
  selfInput: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    borderRadius: 4,
    padding: 8
  }
});