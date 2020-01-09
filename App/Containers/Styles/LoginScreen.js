import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  container: {
    height: '100%',
  },
  logoWraper: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: 20
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 100,
  },
  sloganWraper: {
    alignSelf: 'center',
    marginTop: 10
  },
  slogan: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  bgImg: {
    position: 'absolute',
    zIndex: -3,
    top: '25%',
    left: '-50%',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    borderColor: 'rgba(0,0,0,.1)',
    borderWidth: 80,
    borderStyle: 'solid',
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 24,
    alignSelf: 'flex-start',
    color: 'rgba(0,0,0,.35)',
    marginBottom: 10,
    fontWeight: '300',
  },
  form: {
    flex: 4,
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
    zIndex: 5
  },
  formRow: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5
  },
  inputIcon: {
    width: 42,
    textAlign: 'center',
    position: "absolute",
    left: 10,
    top: 0,
    lineHeight: 48
  },
  formInput: {
    width: '100%',
    height: 48,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 62,
    paddingRight: 16,
    borderWidth: 0
  },
  rememberWraper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
    justifyContent: 'space-between'
  },
  rememberItem: {
    borderBottomWidth: 0,
    width: 160,
    marginLeft: 0,
    flexDirection: 'row'
  },
  rememberLabel: {
    fontSize: 13,
    color: '#aaa',
    paddingLeft: 10
  },
  btnBg: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  btnTxt: {
    color: '#ffff',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  forgotBtnText: {
    fontSize: 14,
    color: '#0066b3'
  },
  error: {
    marginLeft: 20,
    color: 'red',
    fontSize: 13
  }
});