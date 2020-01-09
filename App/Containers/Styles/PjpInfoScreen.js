import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.05)',
    flexDirection: 'row',
    alignItems: "center"
  },
  titleText: {
    fontWeight: 'bold',
    margin: 16,
    flex: 1
  },
  acrdIcon: {
    fontSize: 24,
    marginRight: 16,
    color: 'rgba(0,0,0,.35)'
  },
  row: {
    flexDirection: 'row',
    marginLeft: 16,
    paddingVertical: 16,
    borderBottomColor: '#c9c9c9',
    borderBottomWidth: 1
  },
  label: {
    paddingRight: 16,
    flex: 2
  },
  value: {
    flex: 3,
    paddingRight: 16
  },
  readonly: {
    color: 'rgba(0,0,0,.5)',
  },
  addBtn: {
    margin: 16
  },
  addBtnBg: {
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  addBtnIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 10
  },
  addBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1
  }
});