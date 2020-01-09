import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  drwaer: {
    height: '100%'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
		backgroundColor: '#1091ff',
    padding: 20
  },
  avatarHolder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,.35)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userIcon: {
    color: '#fff',
    fontSize: 92
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 26,
    marginTop: 10
  },
  userDes: {
    color: '#fff',
    fontSize: 16
  },
  userID: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,.65)',
    marginTop: 5,
  },
  listItem: {
    height: 58
  },
  listLabel: {
    height: 58
  },
  listIcon: {
    color: 'rgba(0,0,0,.35)'
  },
  listItemText: {
    fontSize: 14
  },
  dNone: {
    display: "none"
  }
});