import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FormFieldSpinner } from '../index';

import { Icon } from './PlatformSpecificModules.web';
import { colors, textStyles, containerStyles } from '../styles';

const SubmitButton = ({ props, context }) => {
    const {
        name,
        label,
        disabled,
        loading,
        onPress,
        onClick,
        children,
        color = 'orange',
        labelColor,
        style,
        labelStyle,
        noValidation, // does not run validators and directly calls onPress
        skipValidation, // runs validators and then calls onPress even if errors
        inverted,
        noBorder,
        left,
    } = props;

    const {
        isError,
        setError,
        errorLabel,
        setErrorLabel,
        isFocused,
        setFocus,
        isValidating,
        setIsValidating,
        formState,
        validateAllFields,
    } = context;

    const [hover, setHover] = useState(false);

    let buttonColors = {
        background:
            color === 'white'
                ? hover
                    ? '#eee'
                    : '#fff'
                : color === 'red'
                ? hover
                    ? '#e1542c'
                    : '#ed5e51'
                : color === 'green'
                ? hover
                    ? '#358201'
                    : '#4AB601'
                : color === 'black'
                ? hover
                    ? '#444'
                    : '#333'
                : color === 'blue'
                ? hover
                    ? '#0a77fc'
                    : '#1e84ff'
                : color === 'orange'
                ? hover
                    ? '#EB654F'
                    : '#FF7E5F'
                : color === 'gray'
                ? hover
                    ? '#666'
                    : '#999'
                : color === 'purple'
                ? hover
                    ? '#7713b3'
                    : '#9730d5'
                : null,

        primary: color === 'white' ? '#333' : '#fff',
        border: color === 'white' ? '#ddd' : '#fff',
    };

    if (inverted) {
        buttonColors = {
            background: color === 'white' ? (hover ? '#444' : '#333') : hover ? '#eee' : '#fff',
            primary: buttonColors.background,
            border: buttonColors.background,
        };
    }

    if (disabled) {
        buttonColors = {
            background: '#ddd',
            primary: '#fff',
            border: '#ddd',
        };
    }

    if (noBorder) {
        buttonColors.border = buttonColors.background;
    }

    if (isError) buttonColors.border = colors.error;

    const onSubmitButtonPress = async () => {
        if (isValidating) return false;

        setIsValidating(true);
        const areAllFieldsValid = noValidation || (await validateAllFields());
        if (noValidation || skipValidation || areAllFieldsValid) {
            onPress && !disabled && (await onPress(formState, areAllFieldsValid, validateAllFields));
            onClick && !disabled && (await onClick(formState, areAllFieldsValid, validateAllFields));
        } else {
            setError(true);
        }

        setIsValidating(false);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            {...props}
            nativeID={'loginButton'}
            onClick={null}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onPress={onSubmitButtonPress}
            style={[
                containerStyles.formFieldContainer,
                styles.formSubmitButton(disabled, inverted, hover, buttonColors, left),
                // isError && containerStyles.formFieldErrorBorder,
                style,
            ]}
        >
            {children ? (
                children
            ) : (
                <Text id={name} style={[textStyles.button, { color: labelColor || buttonColors.primary }, labelStyle]}>
                    {label || 'SUBMIT'}
                </Text>
            )}
            {!!isError && (
                <Icon
                    name={'alert-circle-outline'}
                    style={{ fontSize: 18, color: colors.formBackground, marginLeft: 10 }}
                />
            )}
            {(!!isValidating || !!loading) && (
                <FormFieldSpinner
                    color={labelColor || buttonColors.primary}
                    style={{ height: 25, width: 25, marginLeft: 10 }}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = {
    formSubmitButton: (disabled, inverted, hover, colors, left) => {
        return {
            ...textStyles.button,
            // cursor: 'pointer',
            flexDirection: 'row',
            // display: 'flex',
            height: inverted ? 26 : 28,
            minWidth: 200,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 24,
            borderColor: colors.border,
            margin: 5,
            paddingLeft: left ? (hover ? 40 : 30) : 30,
            paddingRight: 30,
            color: colors.primary,
            backgroundColor: colors.background,
            alignItems: left ? 'flex-start' : 'center',
            justifyContent: 'center',
            transition: 'background-color .418s, border-color .218s, box-shadow .218s',
        };
    },
};

export default SubmitButton;
