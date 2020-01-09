import { StyleSheet } from 'react-native'
import { Dimensions } from "react-native"

export default StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 16,
        color: 'rgba(0,0,0,1)',
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8
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
        borderRadius: 4
    },
    itemHeader: {
        backgroundColor: '#f4f4f4',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    itemheaderLabel: {
        marginVertical: 8,
        marginRight: 8,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,.5)',
        fontSize: 13,
        textTransform: 'uppercase',
        flex: 1
    },
    itemHeaderValue: {
        flex: 4,
        margin: 8,
        color: '#111',
        fontSize: 14,
        fontWeight: 'bold'
    },
    cardBody: {
        backgroundColor: '#fff',
        paddingTop: 10,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 8
    },
    mb: {
        marginBottom: 14
    },
    itemLabel: {
        fontSize: 14,
        color: 'rgba(0,0,0,.5)',
        marginLeft: 16,
        marginRight: 5,
        flex: 2
    },
    itemValue: {
        color: '#111',
        flex: 3,
        marginLeft: 5,
        marginRight: 16
    },
    searchBar: {
        backgroundColor: '#f4f4f4',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.05)'
    },
    searchInput: {
        paddingVertical: 0,
        height: 38,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.15)',
        marginHorizontal: 16,
        marginVertical: 8,
        paddingLeft: 16,
        paddingRight: 42,
        backgroundColor: '#fff',
        borderRadius: 18
    },
    searchClear: {
        position: 'absolute',
        top: 8,
        right: 26
    },
    searchClearIcon: {
        fontSize: 20,
        color: 'rgba(0,0,0,.35)',
        marginTop: 8
    },
    searchIcon: {
        fontSize: 24,
        marginTop: 6
    },
    noData: {
        textAlign: 'center',
        margin: 30,
        color: 'rgba(0,0,0,.5)'
    },
    itemFtrBtn: {
        paddingHorizontal: 8,
        height: 46,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,.15)'
    },
    itemFtrBtnText: {
        color: '#347eff',
        fontWeight: 'bold',
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginHorizontal: 4
    },
    itemFtrIcon: {
        color: '#347eff',
        fontSize: 28,
        marginHorizontal: 4
    },
    textInfo: {
        color: '#00b3b3'
    },
    absoluteElement: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: '#fff'
    }
});