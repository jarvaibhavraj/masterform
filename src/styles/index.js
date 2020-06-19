import { Platform } from 'react-native';

export const colors = {
    formPrimary: '#222222',
    formSecondary: '#2192e4',
    formBackground: '#ffffff',
    formBorder: '#cccccc',

    input: '#222222',
    label: '#444444',
    placeholder: '#aaaaaa',
    disabled: '#eeeeee',

    error: '#FD4B20',
    success: '#53cd01',
    accent: '#ff7e5f',
};

const sizes = {
    tiny: 12,
    small: 14,
    medium: 16,
    large: 18,
};

export const textStyles = {
    input: {
        fontFamily: '-apple-system, Segoe UI, sans-serif',
        fontSize: sizes.small,
        color: colors.input,
        fontWeight: 'normal',
    },
    label: {
        fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif',
        fontSize: sizes.tiny,
        color: colors.label,
        fontWeight: 'normal',
    },
    section: {
        fontFamily: '-apple-system, Segoe UI, sans-serif',
        fontSize: sizes.large,
        color: colors.formPrimary,
        fontWeight: 'normal',
    },
    button: {
        fontFamily: 'sans-serif',
        fontSize: sizes.small,
        color: colors.formPrimary,
        fontWeight: 'bold',
    },
};

export const containerStyles = {
    formFieldContainer: {
        // flex: 1,
        minWidth: 200,
        // width: 280,
        maxWidth: 410,
        // flexDirection: 'column',
        margin: 4,
        backgroundColor: colors.formBackground,
        // alignItems: 'flex-start',
    },

    formFieldFocusBorder:
        Platform.OS === 'web'
            ? {
                  boxShadow: `1px 2px 3px ${colors.formBorder}`,
              }
            : {
                  shadowColor: colors.formPrimary,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.4,
                  elevation: 2,
                  borderWidth: 0,
                  backgroundColor: colors.formBackground,
                  // margin: 2,
              },
    formFieldErrorBorder: {
        borderWidth: 1.5,
        borderColor: colors.error,
    },

    formFieldLabel: {
        ...textStyles.label,
        marginLeft: 8,
        marginBottom: 4,
    },
    formFieldErrorLabel: {
        ...textStyles.input,
        fontSize: sizes.tiny,
        color: colors.error,
        // textAlign: 'right',
        marginLeft: 8,
    },
};
