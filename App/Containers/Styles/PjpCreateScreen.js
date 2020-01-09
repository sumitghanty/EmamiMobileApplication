import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
  },
  titleText: {
    fontSize: 16,
    color: '#111',
  },
  formLabel: {
    flex: 2,
    paddingRight: 10,
    fontSize: 16,
    color: 'rgba(0,0,0,.5)',
    marginTop: 16,
    marginBottom: 16
  },
  formInput: {
    flex: 3,
    paddingRight: 16
  },
  value: {
    flex: 3,
    marginRight: 16,
    color: '#111',
  },
  readOnly: {
    color: 'rgba(0,0,0,.5)'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ftrBtn: {
    margin: 16
  },
  ftrBtnBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24
  },
  ftrBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase'
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
});