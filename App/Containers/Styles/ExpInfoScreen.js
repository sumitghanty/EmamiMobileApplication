import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    scrollView: {
        paddingBottom: 20
    },
    row: {
        flexDirection: 'row',
        marginLeft: 16,
        paddingVertical: 16,
        borderBottomColor: '#c9c9c9',
        borderBottomWidth: 1
    },
    noRow: {
        flexDirection: 'column'
    },
    label: {
        paddingRight: 16,
        flex: 1
    },
    value: {
        flex: 1,
        color: 'rgba(0,0,0,.5)',
        paddingRight: 16
    },
    input: {
        color: '#111'
    },
    btn: {
        marginHorizontal: 16,
        marginTop: 24
    },
    btnBg: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTxt: {
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 14,
        textTransform: 'uppercase',
    },
    btnIcon: {
      color: '#fff',
      fontSize: 20,
      marginRight: 12
    },
    mb: {
      marginBottom: 20
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
      fontSize: 16,
      color: '#111',
      fontWeight: 'bold'
    },
    acrdIcon: {
      fontSize: 22,
      color: 'rgba(0,0,0,.5)',
      marginLeft: 16
    },
    subTitle: {
        color: 'rgba(0,0,0,.35)',
        fontSize: 14,
        marginHorizontal: 16,
        marginTop: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1
    },    
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  datePickerIcon: {
    color: 'rgba(0,0,0,.5)',
    marginHorizontal: 10,
    fontSize: 20
  },
  datePickerLabel: {
    flex: 1
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
    width: Dimensions.get('window').width - 32
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 16,
    color: '#111'
  },
  modalLabel: {
    marginHorizontal: 16,
    marginVertical: 8,
    color: 'rgba(0,0,0,.5)'
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 20
  },
  modalFotterBtn: {
    flex: 1
  },
  modalFotterBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 14,
    textTransform: 'uppercase'
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
    marginLeft: 16,
    paddingRight: 16
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
  pickerBlock: {
    borderRadius: 4,
    marginHorizontal: 16,
    backgroundColor: '#f4f4f4',
    borderColor: 'rgba(0,0,0,.1)',
    borderWidth: 1
  },
  attachTitle: {
    color: 'rgba(0,0,0,.35)',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 16,
    marginTop: 16
  },
  atchFileRow: {
    marginTop: 6,
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
  uploadError: {
    textAlign: 'center',
    color: 'red',
    fontSize: 14,
    marginTop:  16,
    marginHorizontal: 16
  }
});