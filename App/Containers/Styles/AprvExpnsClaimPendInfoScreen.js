import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,    
  },
  accordionHeader: {
    backgroundColor: '#f4f4f4',
    borderBottomColor: 'rgba(0,0,0,.035)',
    borderBottomWidth: 1,
    borderTopColor: 'rgba(0,0,0,.035)',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  acrdTitle: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    fontWeight: 'bold'
  },
  acrdIcon: {
    fontSize: 22,
    color: 'rgba(0,0,0,.5)',
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.05)',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 3,
    paddingVertical: 12
  },
  cardTile: {
    flex: 1,
    marginRight: 16,
    marginLeft: 6,
    fontSize: 14,
    color: '#111',
    fontWeight: 'bold'
  },
  cardTileIcon: {
    fontSize: 16,
    width: 48,
    textAlign: 'center'
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
  }
});