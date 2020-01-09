import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.1)'
    },
    typeIconHolder: {
        width: 54,
        height: 54,
        alignSelf: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 27,
        justifyContent: 'center',
        marginRight: 16
    },
    typeIcon: {
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
    },
    typeValue: {
        flex: 1,
        fontSize: 18,
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
    },
    attachInfo: {
        margin: 16,
    },
    attachRow: {
        flexDirection: 'row',
        marginTop: 8
    },
    attachName: {
        flex: 4,
        color: 'rgba(0,0,0,.5)',
        marginRight: 10
    },
    attachSize: {
        flex: 1,
        color: 'rgba(0,0,0,.5)',
        textAlign: 'right'
    }
});