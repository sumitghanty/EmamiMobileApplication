import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0066b3',
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    color: '#fff',    
    fontWeight: 'bold',    
  },
  formLabel: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    color: 'rgba(0,0,0,.5)',
    marginTop: 16,
    marginBottom: 16
  },
  readOnly: {
    flex: 1,
    color: 'rgba(0,0,0,.5)',
    paddingRight: 16
  },
  formInput: {
    flex: 1,
    paddingRight: 16,
    fontSize: 16
  }, 
  attachType: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6
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
  ftrBtnBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    margin: 16,
    borderRadius: 24
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
  errorText: {
    fontSize: 12,
    marginHorizontal: 16,
    color: 'red'
  },
  atchFileRow: {
    marginBottom: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  atchFileName: {
    fontSize: 12,
    flex: 1
  },
  actionBtn: {
    width: 32,
    height: 32,
    marginLeft: 10,
    borderColor: '#d9534f'
  },
  actionBtnIco: {
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'center',
    width: 32,
    color: '#d9534f',
    fontSize: 16
  },
  actionBtnPrimary: {
    borderColor: '#0066b3'
  },
  actionBtnIcoPrimary: {
    color: '#0066b3'
  },
  atchMdlHeader: {
    backgroundColor: '#0B5FFF',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  atchMdlHdrTtl: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  atchMdlBody: {
    padding: 16
  },
  atchMdlLabel: {
    fontSize: 14,
    marginBottom: 16,
    color: 'rgba(0,0,0,.5)'
  },
  pickerHolder: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    marginBottom: 16,
    borderRadius: 4
  },
  atchTypeSelect: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4
  },
  chooseBtn: {
    alignSelf: 'center',
    backgroundColor: '#ff4813',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24
  },
  chooseBtnIcon: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10
  },
  chooseBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  atchMdlFtr: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.1)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  atchMdlFtrBtn: {
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4
  },
  atchMdlFtrBtnSecondary: {
    backgroundColor: 'red'
  },
  atchMdlFtrBtnPrimary: {
    backgroundColor: '#0B5FFF'
  },
  atchMdlFtrBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  attachType: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6
  },      
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16
  },
  pickerWraper: {
    flex: 1
  },
  pickerBtn: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingVertical: 10,
   height: 50,
  },
  pickerBtnText: {
    flex: 1
  },
  pickerBtnIcon: {
    marginHorizontal: 12,
    color: 'rgba(0,0,0,.5)',
    fontSize: 19
  },
  inputLabel: {
    marginHorizontal: 16
  },
  textArea: {
    marginHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  addonBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 44,
    height: 44,
    backgroundColor: '#ff4813',
    borderRadius: 22,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addonBtnIcon: {
    color: '#fff',
    fontSize: 26
  },
  modalHeader: {
    backgroundColor: '#0066b3',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  modalTitle: {
    fontSize: 16,
    color: '#fff'
  },
  modalFooter: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mdlFtrBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    margin: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mdlFtrBtnDanger: {
    backgroundColor: 'red'
  },
  mdlFtrBtnSuccess: {
    backgroundColor: '#3fb748'
  },
  mdlFtrBtnIcon: {
    fontSize: 24,
    color: '#fff'
  },
  mdlFtrBUtton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginVertical: 8
  },
  modalBody: {
    padding: 16,
    backgroundColor: '#e0e0e0',
    flex: 1
  },
  cmntHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  cmntHeaderIcon: {
    fontSize: 26,
  },
  cmntHeaderTtl: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  chartBlock: {
    padding: 10,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginBottom: 16
  },
  chartBlockPrimary: {
    marginRight: 16,
    marginLeft: 80,
    borderTopLeftRadius: 6,
    backgroundColor: '#fff'
  },
  chartBlockSecondary: {
    marginLeft: 16,
    marginRight: 80,
    borderTopRightRadius: 6,
    backgroundColor: '#e2ffc7'
  },
  carotIcon: {
    position: 'absolute',
    top: 8
  },
  chartCarot:{
    position: 'absolute',
    top: 0,
    borderWidth: 8,
    width: 16,
    height: 16,
  },
  chartCarotSecondary: {
    left: -15,
    borderBottomColor: 'rgba(0,0,0,0)',
    borderLeftColor: 'rgba(0,0,0,0)',   
    borderTopColor: '#e2ffc7',
    borderRightColor: '#e2ffc7',
  },
  chartCarotPrimary: {
    right: -15,
    borderBottomColor: 'rgba(0,0,0,0)',
    borderLeftColor: '#fff',    
    borderTopColor: '#fff',
    borderRightColor: 'rgba(0,0,0,0)',
  },
  chartText: {
    fontSize: 14
  }
});