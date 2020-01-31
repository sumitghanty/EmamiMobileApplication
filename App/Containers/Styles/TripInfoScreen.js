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
    },
    status: {
        color: '#00b3b3',
    },
    row: {
        flexDirection: 'row',
        marginLeft: 16,
        paddingVertical: 16,
        borderBottomColor: '#c9c9c9',
        borderBottomWidth: 1
    },
    label: {
        paddingRight: 16,
        flex: 2
    },
    value: {
        flex: 3,
        color: 'rgba(0,0,0,.5)',
        paddingRight: 16
    }
});