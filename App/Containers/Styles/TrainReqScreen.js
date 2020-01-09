import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollView: {
    paddingBottom: 30
  },
  title: {
    fontSize: 16,
    color: '#111',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    marginBottom: 16
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
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3
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
  }
});