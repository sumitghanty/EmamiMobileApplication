import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  content: {
    marginBottom: 20
  },
  accordionHeader: {
    backgroundColor: '#f8f8f8',
    borderBottomColor: 'rgba(0,0,0,.1)',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  acrdTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111'
  },
  acrdIcon: {
    fontSize: 18,
    color: 'rgba(0,0,0,.5)',
    marginLeft: 16
  },
  form: {
    marginTop: 20
  },
  formLabel: {
    flex: 1,
    paddingRight: 10,
    fontSize: 16,
    color: 'rgba(0,0,0,.5)',
    marginVertical: 12
  },
  formInput: {
    flex: 1
  },
  value: {
    flex: 1,
    color: 'rgba(0,0,0,.5)',
    marginVertical: 12
  },
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16
  },
  atchBtnBg: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachIcon: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10
  },
  attachBtnTxt: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold'
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
    width: 28,
    height: 28,
    marginLeft: 10,
    borderColor: '#d9534f'
  },
  actionBtnIco: {
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'center',
    width: 28,
    color: '#d9534f',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ftrBtn: {
    flex: 1
  },
  ftrBtnBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
    fontSize: 16,
    marginRight: 10
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginHorizontal: 16
  }
});