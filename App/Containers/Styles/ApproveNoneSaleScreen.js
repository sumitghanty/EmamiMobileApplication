import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    subHeader: {
        backgroundColor: '#f4f4f4',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,.05)',
        marginBottom: 16
    },
    subHeaderCol: {
        flex: 1,
        padding: 16
    },
    subHeaderLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 3,
        color: 'rgba(256,256,256,.75)'
    },
    subHeaderValue: {
        fontSize: 16,
        color: '#fff'
    },
    linkItem: {
        marginHorizontal: 16,
        marginVertical: 10
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