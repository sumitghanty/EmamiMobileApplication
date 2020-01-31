import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#0B5FFF',
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,.75)',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginRight: 10
    },
    headerValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1
    }
});