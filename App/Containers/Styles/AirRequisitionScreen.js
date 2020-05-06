import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollView: {
    paddingBottom: 30
  },
  titleRow:{
    backgroundColor: '#0066b3',
    padding: 16,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  formLabel: {
    flex: 2,
    paddingRight: 10,
    fontSize: 16,
    color: 'rgba(0,0,0,.5)',
    marginTop: 16,
    marginBottom: 16
  },
  readOnly: {
    color: 'rgba(0,0,0,.5)'
  },
  formInput: {
    flex: 3,
    paddingRight: 16
  },
  ftrBtn: {
    marginHorizontal: 20,
    marginTop: 30
  },
  brdBtn: {
    borderColor: '#0066b3'
  },
  brdBtnTxt: {
    color: '#0066b3'
  },
  ftrBtnBg: {
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ftrBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginHorizontal: 8,
  },
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16
  },
  atchFileRow: {
    marginBottom: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  atchFileName: {
    fontSize: 12,
    flex: 3
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
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  datePickerIcon: {
    color: 'rgba(0,0,0,.5)',
    marginHorizontal: 10
  },
  datePickerLabel: {
    flex: 1
  },
  inputType: {
    fontSize: 16
  },
  pickerWraper: {
    flex: 3
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
  errorText: {
    fontSize: 12,
    marginHorizontal: 16,
    color: 'red'
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

  flightTitle: {
    color: '#ff4813',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16
  },
  flightSubTitle: {
    fontSize: 14,
    color: 'rgba(0,0,0,.5)',
    marginHorizontal: 16,
  },
  ticketItem: {
    flexDirection: 'row',
  },
  selectedTicket: {
    backgroundColor: '#0066b3'
  },
  ticketColumn: {
    backgroundColor: '#1ba032',
    borderRadius: 12,
    padding: 16,
    marginTop: 16
  },
  ticketLeft: {
    flex: 5,
    borderRightColor: '#7bf791',
    borderRightWidth: 1,
    marginLeft: 16
  },
  selectedTicketLeft:{
    borderRightColor: '#013e6b'
  },
  ticketRight: {
    flex: 2,
    borderLeftColor: '#105f1e',
    borderLeftWidth: 1,
    marginRight: 16
  },
  selectedTicketRight:{
    borderLeftColor: '#32a4fb'
  },

  dangerTicket: {
    backgroundColor: '#fd6363',
  },
  dangerTicketLeft: {
    borderRightColor: '#da3939',
  },
  dangerTicketRight: {
    borderLeftColor: '#ff9090',
  },

  circle: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    position: 'absolute',
    top: '50%',
    marginTop: 8
  },
  circleLeft: {
    left: -8
  },
  circleRight: {
    right: -8
  },
  nameLabel: {
    color: 'rgba(0,0,0,.5)',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  flightName: {
    color: '#fff',
    fontSize: 19,
    marginBottom:4
  }, 
  ticketLabel: {
    color: 'rgba(0,0,0,.5)',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 12
  },
  ticketValue: {
    color: '#fff',
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#fff'
  },
  currency: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,.65)',
    letterSpacing: 2,
    alignSelf: 'center',
    marginBottom: 12
  },
  oop: {
    color: 'rgba(0,0,0,.5)',
    fontSize: 11,
    fontWeight: 'bold',
  },
  oopValue: {
    fontSize: 16,
    color: '#fff',
  },
  checkBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,.35)',
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 12
  },
  checkIcon: {
    color: '#fff',
    fontSize: 24
  },
  accordionHeader: {
    backgroundColor: '#0066b3',
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
  mt: {
    marginTop: 16
  },
  textArea: {
    marginHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  inputLabel: {
    marginHorizontal: 16
  },
});