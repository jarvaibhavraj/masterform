import React from 'react';

export default ({ props, context }) => {
    const { name, label, onlineOnly, onChangeText, validators, containerStyle, open } = props;
    const {
        value,
        setValue,
        isError,
        setError,
        errorLabel,
        setErrorLabel,
        isFocused,
        setFocus,
        isValidating,
        setIsValidating,
        validateField,
    } = context;

    return null;
};
