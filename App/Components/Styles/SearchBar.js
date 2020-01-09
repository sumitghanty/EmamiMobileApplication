import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	bar: {
		backgroundColor: '#f4f4f4',
		paddingHorizontal: 16,
		paddingVertical: 8,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,.05)'
	},
	searchInput: {
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,.25)',
		paddingLeft: 32,
		paddingRight: 10,
		height: 38
	},
	searchIcon: {
		position: 'absolute',
		left: 16,
		top: 16,
		width: 32,
		fontSize: 24,
		color: 'rgba(0,0,0,.35)'
	},
	searchBtn: {
		backgroundColor: '#2196f3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 3,
		borderRadius: 4,
		paddingHorizontal: 8,
		paddingVertical: 10,
		marginLeft: 12
	},
	searchBtnTxt: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#fff',
		textTransform: 'uppercase',
		letterSpacing: 1
	}
});