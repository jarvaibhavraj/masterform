import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';

import { Icon } from './PlatformSpecificModules.web';
import { colors, textStyles, containerStyles } from '../styles';

export default ({ props, context }) => {
    const {
        name,
        value: overrideValue,
        label,
        radio,
        noUncheck,
        disabled,
        onChange,
        validators,
        containerStyle,
        heading,
        color = colors.formSecondary,
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

    // Take internal value only if override value is not given
    const actualValue = overrideValue !== undefined ? overrideValue : value;

    useEffect(() => {
        overrideValue !== undefined && setValue(overrideValue);
    }, [overrideValue]);

    const updateValue = (event) => {
        event.stopPropagation();
        if (!noUncheck || !actualValue) {
            setValue(!actualValue);
            onChange && onChange(!actualValue);
        }
    };

    return (
        <View style={[containerStyles.formFieldContainer, { minWidth: 0 }, containerStyle]}>
            {heading && <Text style={[containerStyles.formFieldLabel]}>{heading && heading.toUpperCase()}</Text>}

            <TouchableOpacity
                activeOpacity={1}
                onPress={Platform.OS !== 'web' && updateValue} // onPress sometimes runs multiple times on web
                onClick={Platform.OS === 'web' && updateValue}
                style={[{ flexDirection: 'row', alignItems: 'center' }]}
            >
                <Icon
                    name={
                        radio
                            ? value
                                ? 'circle-slice-8'
                                : 'checkbox-blank-circle-outline'
                            : value
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                    }
                    color={isError ? colors.error : disabled ? colors.disabled : value ? color : colors.placeholder}
                    style={{ fontSize: 22, marginRight: 5 }}
                />
                <Text style={[containerStyles.formFieldLabel, { marginRight: 10, marginBottom: 0, marginLeft: 0 }]}>
                    {label && label.toUpperCase()}
                </Text>
            </TouchableOpacity>

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}
        </View>
    );
};
