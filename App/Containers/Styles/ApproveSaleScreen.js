import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingVertical: 15
  },
  linkItem: {
    marginHorizontal: 16,
    marginVertical: 15
  },
  card: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,  
      elevation: 5,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center'
  },
  cardTitle: {
      fontSize: 16,
      padding: 16,
      flex: 1
  },
  cardIcon: {
      fontSize: 22,
      paddingVertical: 32,
      paddingRight: 16,
      color: 'rgba(0,0,0,.5)'
  }
});