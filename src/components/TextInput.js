import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import { Icon } from './PlatformSpecificModules.web';
import { colors, textStyles, containerStyles } from '../styles';

export default ({ props, context }) => {
    const {
        name,
        label,
        disabled,
        compact,
        errors,
        editable = true,
        onBlur = () => null,
        errorConditions = [],
        startText,
        rightIconName,
        rightIconSize,
        rightIconColor,
        rightIconOnPress,
        onChangeText,
        validators,
        containerStyle,
        formFieldStyle,
        formFieldInputStyle,
        formFieldLabelStyle,
        number = false,
    } = props;

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

    const [doingWork, setDoingWork] = useState(false);

    const paddingHorizontal = Platform.OS === 'web' && !compact ? 16 : 8;
    const paddingVertical = Platform.OS === 'web' && !compact ? 8 : 4;

    if (startText && value && !value.startsWith(startText)) setValue(startText + value);

    let valueWithoutStartText =
        value && startText && value.startsWith(startText) ? value.replace(startText, '') : value;
    if (!valueWithoutStartText && valueWithoutStartText !== 0) valueWithoutStartText = '';

    const errorConditionMet = errorConditions.find((item) => !item.value);

    return (
        <View style={[containerStyles.formFieldContainer, compact && { minWidth: 50 }, containerStyle]}>
            <Text style={{ ...containerStyles.formFieldLabel, ...formFieldLabelStyle }}>
                {label && label.toUpperCase()}
            </Text>

            <View
                style={[
                    styles.textInput,
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                    },
                    compact && { minHeight: 24 },
                    formFieldStyle,
                    isFocused && containerStyles.formFieldFocusBorder,
                    disabled && { backgroundColor: colors.disabled },
                    (isError || errorConditionMet) && containerStyles.formFieldErrorBorder,
                ]}
            >
                {startText && (
                    <Text style={[textStyles.input, { marginLeft: paddingHorizontal / 2 }, formFieldInputStyle]}>
                        {startText}
                    </Text>
                )}
                <TextInput
                    id={name}
                    editable={!disabled}
                    placeholder={'. . .'}
                    placeholderTextColor={colors.placeholder}
                    onFocus={() => {
                        setError(false);
                        setFocus(true);
                    }}
                    keyboardType={number ? 'numeric' : 'default'}
                    nextFocusForward
                    {...props}
                    onBlur={() => {
                        setFocus(false);
                        validateField();
                        onBlur && onBlur();
                    }}
                    value={valueWithoutStartText}
                    // onKeyPress={e => {
                    //     if (e.key === 'Enter') {
                    //         // e.preventDefault();
                    //         console.log(document.querySelectorAll('tabable'));
                    //     }
                    // }}
                    onChangeText={(text) => {
                        setValue(number ? parseFloat(text) : text);
                        onChangeText && onChangeText(number ? parseFloat(text) : text);
                    }}
                    style={[
                        textStyles.input,
                        Platform.OS === 'web' && { outline: 'none' },
                        compact && { minWidth: 50 },
                        // disabled && { fontSize: 16 },
                        {
                            flex: 1,
                            paddingTop: paddingVertical,
                            paddingBottom: paddingVertical,

                            paddingLeft: paddingHorizontal / (startText ? 2 : 1),
                            paddingRight: paddingHorizontal,
                        },
                        formFieldInputStyle,
                    ]}
                />
                {rightIconName && (
                    <TouchableOpacity
                        onPress={async () => {
                            if (doingWork) return;
                            setDoingWork(true);
                            rightIconOnPress && (await rightIconOnPress());
                            setDoingWork(false);
                        }}
                    >
                        <Icon
                            name={doingWork ? 'timer-sand' : rightIconName}
                            style={{
                                cursor: 'pointer',
                                fontSize: rightIconSize || 20,
                                color: rightIconColor || colors.label,
                                marginRight: paddingHorizontal / 2,
                                marginLeft: paddingHorizontal / 2,
                            }}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {(isError || errorConditionMet) && (
                <Text style={containerStyles.formFieldErrorLabel}>
                    {isError ? errorLabel : errorConditionMet.label}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        ...textStyles.input,
        minHeight: 36, // Required for iOS; too small height
        borderWidth: 1,
        borderColor: colors.formBorder,
        borderRadius: 5,
        // backgroundColor: 'blue',
    },
});
