import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1
  },
  scroll: {
    flexGrow: 1,
  },
  menuBtn: {
    position: 'absolute',
    zIndex: 199,
    left: 10,
    top: 11,
    width: 42,
    height: 42,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5    
  },
  menuBtnIcon: {
    fontSize: 26
  },
  titleBlock: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingLeft: 62
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  userBlock: {
    flexDirection: 'row',
    marginBottom: 6,
    backgroundColor: '#fff'
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    alignSelf: "stretch"
  },
  userInfo: {
    padding: 20,
    flex: 1
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3
  },
  userId: {
    fontSize: 14,
    color: '#7a7a7a',
    marginBottom: 8
  },
  userRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    flex: 3,
    fontSize: 14,
    color: '#2b3f4e',
    paddingRight: 5
  },
  value: {
    fontSize: 14,
    color: '#7a7a7a',
    flex: 5
  },
  userDetails: {
    padding: 20,
    marginBottom: 6,
    backgroundColor: '#fff'
  },
  userTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 16
  },
  infoLable: {
    width: 100,
    flex: 0
  },
  sliderItem: {
    marginTop: 20, 
  },
  sliderItemBlock: {
    padding: 20,
    borderRadius: 8
  },
  slideIcon: {
    fontSize: 60,
    marginTop: 16,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#fff'
  },
  slideTitle: {
    textAlign: 'center',
    marginVertical: 10,
    alignSelf: 'center',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#fff'
  },
  copyright: {
    fontSize: 11,
    color: 'rgba(0,0,0,.35)',
    alignSelf: 'center',
    margin: 10
  }
});