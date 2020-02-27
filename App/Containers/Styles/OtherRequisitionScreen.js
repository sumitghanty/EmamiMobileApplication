import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    paddingBottom: 30
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
  formInput: {
    flex: 1,
    paddingRight: 16,
    fontSize: 16
  },  
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16
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
    paddingVertical: 14
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
  }
});