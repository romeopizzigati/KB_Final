import { StatusBar, StyleSheet } from 'react-native';

import { Theme } from "@/constants/Colors";

export const styles = StyleSheet.create({
    /* === CONTAINERS === */
    background: {
        flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    },
    containerHome: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // or 'transparent'
        padding: 20,
    },
    container: { 
        flex: 1,
        paddingTop: StatusBar.currentHeight || 0,
        padding: 16,
        gap: 4,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        paddingLeft: 28,
        paddingRight: 28,
        overflow: 'hidden',
    },
    switchContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },

    /* === TEXT STYLES === */
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Monoton_400Regular',
        lineHeight: 40,
        textAlign: "center",
        marginBottom: 20,
        marginTop: 5
    },
    subtitle: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: Theme.link,
    },
    label: { 
        fontSize: 16, 
        marginBottom: 8,
        fontFamily: "Futura",
        textDecorationLine:"underline"
    },
    buttonText: { 
        color: Theme.white, 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },

    /* === BUTTONS === */
    getStartedButton: {
        backgroundColor: Theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    primaryButton: { 
        backgroundColor: Theme.primary, 
        padding: 12, 
        borderRadius: 5, 
        alignItems: 'center', 
        flex: 1, 
        marginHorizontal: 5 
    },
    dateButton: { 
        backgroundColor: Theme.primary, 
        padding: 12, 
        borderRadius: 5, 
        alignItems: 'center',
        marginHorizontal: 5 
    },
    secondaryButton: { 
        backgroundColor: Theme.secondary 
    },
    successButton: {
        backgroundColor: Theme.success,
        padding: 12,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    dangerButton: {
        backgroundColor: Theme.danger,
        padding: 12,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: Theme.danger,
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
    },

    /* === FORMS & INPUTS === */
    picker: {
        backgroundColor: Theme.white,
        height: 200,
        paddingHorizontal: 10,
        marginBottom: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.green,
        justifyContent: 'center',
    },
    input: {
        backgroundColor: Theme.white,
        height: 50,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 10,
        color: Theme.black,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.gray,
        fontFamily: "Futura"
    },

    /* === LIST & ITEMS === */
    itemContainer: {
        backgroundColor: Theme.white,
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.gray,
        shadowColor: Theme.black,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'column', // better stacking of data
      },
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.black,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 8,
      },      
    itemSubText: {
        fontSize: 14,
        color: Theme.gray,
        marginTop: 4,
        fontWeight: 'bold',
    },
    itemDangerText: {
        fontSize: 14,
        color: Theme.danger,
        marginTop: 4,
        fontWeight: 'bold',
    },

    /* === MODALS & OVERLAYS === */
    modalContainer: {
        flex: 1,
        backgroundColor: Theme.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    loadingContainer: {
        alignItems: 'center',
    },

    /* === ICONS & IMAGES === */
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20, // use `gap` or `marginRight` on icons if not supported
        marginTop: 10,
      },
    icon: {
        marginHorizontal: 5,
        padding: 8
    },    
});

