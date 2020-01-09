import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container: {
		flexGrow: 1,
	},
	scrollView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 30
	},
	label: {
		fontSize: 13,
		textAlign: 'center',
		marginBottom: 16,
		color: 'rgba(0,0,0,.35)',
		fontWeight: 'bold',
		letterSpacing: 1
	},
	input: {
		fontSize: 18,
		color: '#111',
		backgroundColor: '#f8f8f8',
		borderWidth: 1,
		borderLeftColor: 'rgba(0,0,0,.15)',
		borderTopColor: 'rgba(0,0,0,.15)',
		borderRightColor: 'rgba(0,0,0,.05)',
		borderBottomColor: 'rgba(0,0,0,.05)',
		textAlign: 'center'
	},
	btn: {
		marginTop: 30,
	},
	btnBg: {
		borderRadius: 24,
		paddingHorizontal: 24,
		paddingVertical: 14,		
	},
	btnText: {
		color: '#fff',
		textAlign: 'center',
		fontWeight: 'bold',
		letterSpacing: 1,
		fontSize: 14
	}
});