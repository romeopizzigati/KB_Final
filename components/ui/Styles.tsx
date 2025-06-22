import { Theme } from '@/constants/Colors';
import { StatusBar, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    /* BACKGROUND & MAIN CONTAINERS */
    /* ENSURES SHARED STYLE(S) ACROSS COMPONENTS */


    // Fullscreen background image style
    background: {
        flex: 1, // Fills the entire screen
        resizeMode: 'cover', // Ensures background image covers space
        justifyContent: 'center', // Center content vertically
    },

    // Generic container with padding and safe area handling
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 0, // Top padding for status bar
        padding: 16,
        gap: 4, // Vertical spacing between child elements
        overflow: 'hidden', // Hide any overflowing content
    },

    // Home screen specific container
    containerHome: {
        flex: 1,
        alignItems: 'center', // Center items horizontally
        justifyContent: 'center', // Center items vertically
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white overlay
        padding: 20,
    },

    // General content wrapper with horizontal padding
    content: {
        flex: 1,
        paddingLeft: 28,
        paddingRight: 28,
        overflow: 'hidden',
    },

    // Modal content container
    modalContainer: {
        flex: 1,
        backgroundColor: Theme.black,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* === TEXT STYLES === */

    // Main title text style
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Monoton_400Regular',
        lineHeight: 40,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 20,
    },

    // Subtitle or smaller header style
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },

    // Default body text
    default: {
        fontSize: 16,
        lineHeight: 24,
    },

    // Slightly bolder body text
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },

    // Label for inputs or small section headings
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "Futura",
        textDecorationLine: "underline",
    },

    // Link-style text (e.g. clickable text)
    link: {
        fontSize: 16,
        lineHeight: 30,
        color: Theme.link,
    },

    // Text inside buttons
    buttonText: {
        color: Theme.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    /* BUTTON STYLES */

    // Main button on home or primary CTA
    getStartedButton: {
        backgroundColor: Theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    // Primary action button (e.g. submit, next)
    primaryButton: {
        backgroundColor: Theme.primary,
        padding: 12,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },

    // Success action button (e.g. save, confirm)
    successButton: {
        backgroundColor: Theme.success,
        padding: 12,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },

    // Button for delete or dangerous action
    dangerButton: {
        backgroundColor: Theme.danger,
        padding: 12,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },

    // Button specifically for picking date
    dateButton: {
        backgroundColor: Theme.primary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },

    // Optional secondary style button
    secondaryButton: {
        backgroundColor: Theme.secondary,
    },

    // Floating close button (e.g. in modals)
    closeButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: Theme.danger,
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
    },

    // Container for grouping buttons horizontally
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },

    /* INPUT & FORM STYLES */

    // Text input field style
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
        fontFamily: "Futura",
    },

    // Picker / dropdown field
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

    // Switch + label row container
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    /* LIST ITEM STYLES */

    // Card-like item container
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
        flexDirection: 'column',
    },

    // Alternative item container (smaller border + shadow)
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

    // Item title text
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.black,
    },

    // General item body text
    itemText: {
        fontSize: 16,
        marginBottom: 8,
    },

    // Subtext for secondary info
    itemSubText: {
        fontSize: 14,
        color: Theme.gray,
        marginTop: 4,
        fontWeight: 'bold',
    },

    // Subtext for warning (e.g. expired)
    itemDangerText: {
        fontSize: 14,
        color: Theme.danger,
        marginTop: 4,
        fontWeight: 'bold',
    },

    /* === ICONS + IMAGES === */

    // Wrapper for grouping icons in item
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 20, // spacing between icons
        marginTop: 10,
    },

    // Style applied to each icon button
    icon: {
        marginHorizontal: 5,
        padding: 8,
    },

    // Fullscreen background image
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },

    /* CAMERA & LOADING */

    // Camera preview full screen
    camera: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },

    // Centered loading spinner
    loadingContainer: {
        alignItems: 'center',
    },
});
