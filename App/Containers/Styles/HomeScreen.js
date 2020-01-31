import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1
  },
  scroll: {
    flexGrow: 1,
  },
  userBlock: {
    marginBottom: 6,
    marginTop: 6,
    padding: 16
  },
  appName: {
    fontSize: 17,
    marginBottom: 8,
    color: '#fff'
  },
  userLabel: {
    fontSize: 14,
    marginBottom: 2,
    color: 'rgba(255,255,255,.75)'
  },
  userId: {
    fontSize: 13
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
    backgroundColor: '#fff'
  },
  userTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10
  },
  infoLable: {
    width: 100,
    flex: 0
  },
  sliderItem: {
    marginVertical: 20, 
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
  carouselWrapper: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor: '#f4f4f4',
    minHeight: 200
  },
  topShadow: {
    minHeight: 6
  },
  copyright: {
    fontSize: 11,
    color: 'rgba(0,0,0,.35)',
    alignSelf: 'center',
    margin: 10
  }
});