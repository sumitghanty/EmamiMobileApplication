import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  header: {
    backgroundColor: '#0066b3',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  row: {
    flexDirection: 'row',
    marginLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)'
  },
  formInput: {
    flex: 1,
    paddingRight: 16
  },
  EJustifvalue: {
    flex: 3,
    color: '#111',
    fontSize: 14,
    paddingRight: 16,
    paddingVertical: 0.5
  },
  ftrBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginHorizontal: 8,
  },
  ftrBtn: {
    marginHorizontal: 20,
    marginTop: 30
  },
  ftrBtnBg: {
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    flex: 2,
    fontSize: 14,
    color: 'rgba(0,0,0,.5)'
  },
  Justiflabel: {
    flex: 2,
    fontSize: 14,
    marginTop: 12,
    color: 'rgba(0,0,0,.5)'
  },
  value: {
    flex: 3,
    fontSize: 14,
    color: '#111',
    marginLeft: 10
  },
  Justifvalue: {
    flex: 3,
    fontSize: 14,
    color: '#111',
    marginLeft: 10
 },
  selfLable: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6
 },
  selfValueBlock: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 6,
    minHeight: 60
  },
  attachInfo: {
    marginVertical: 16,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
},
attachmentLabel: {
    fontSize: 13,
    color: '#777',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8
},
atchFileRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingRight:16,
    borderTopWidth: 1,
    borderTopColor: '#ddd'
},
atchFileRowLeft: {
    flex: 1,
    marginRight: 16
},
atchFileName: {
    color: '#111',
    fontSize: 13
},
atchType: {
    color: 'rgba(0,0,0,.5)',
    fontSize: 12
},
actionBtn: {
    width: 42,
    height: 42,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#0066b3',
},
actionBtnIco: {
    fontSize: 20,
    color: '#0066b3'
},
title: {
    color: '#ff4813',
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 16,
    marginTop: 16
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
    color: 'rgba(255,255,255,.5)',
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
    color: 'rgba(255,255,255,.5)',
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
    color: '#fff',
    marginTop: 16
  },
  currency: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,.65)',
    letterSpacing: 2,
    alignSelf: 'center',
    marginBottom: 20
  },
  oop: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  oopValue: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center'
  },
});