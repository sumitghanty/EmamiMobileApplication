import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#f4f4f4',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.05)',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerLabel: {
        fontSize: 12,
        color: 'rgba(0,0,0,.5)',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginRight: 10
    },
    headerValue: {
        fontSize: 16,
        color: '#000',
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