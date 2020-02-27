import { StyleSheet } from 'react-native';

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
  },
  acrdTitle: {
    flex: 1,
    fontSize: 16,
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
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'#111',
    margin: 16
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
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
  }
});