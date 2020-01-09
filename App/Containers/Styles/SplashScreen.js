import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30
    },
    logo: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: 100,
        marginBottom: 50
    },
    welcome: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,.35)',
        letterSpacing: 5,
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    titleWraper: {
        alignSelf: 'center'
    },
    title: {
        fontSize: 32
    }
});