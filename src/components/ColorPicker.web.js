import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { TwitterPicker } from 'react-color';

import { colors, textStyles, containerStyles } from '../styles';

const ColorPicker = ({ props, context }) => {
    const { name, label, placeholder, onChange, validators, containerStyle } = props;
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

    const defaultColor = '#fff';
    const [isOpen, setIsOpen] = useState(false);

    const colorLuminance = hexColor => {
        const hexToRgb = hex =>
            hex
                .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
                .substring(1)
                .match(/.{2}/g)
                .map(x => parseInt(x, 16));

        const [r, g, b] = hexToRgb(hexColor);

        return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    const hex = (value && value.hex) || (props.value && props.value.hex);
    const swatchColor = hex || value || props.value || defaultColor;
    const swatchBorderColor = colorLuminance(swatchColor) > 200 ? colors.label : colors.formBackground;

    return (
        <View style={containerStyles.formFieldContainer}>
            {/*<Text style={containerStyles.formFieldLabel}>{label && label.toUpperCase()}</Text>*/}
            <TouchableOpacity
                activeOpacity={1}
                onClick={() => setIsOpen(true)}
                style={[
                    styles.colorPicker,
                    containerStyle,
                    {
                        borderColor: isError ? colors.error : colors.formBorder,
                    },
                ]}
            >
                <Text style={textStyles.label}>{label && label.toUpperCase()}</Text>
                <View style={[styles.swatch, { backgroundColor: swatchColor, borderColor: swatchBorderColor }]} />
            </TouchableOpacity>

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}

            {isOpen && (
                <View style={styles.popover}>
                    <TouchableOpacity activeOpacity={1} onClick={() => setIsOpen(false)} style={styles.overlay} />

                    <TwitterPicker
                        color={value || props.value || defaultColor}
                        onChange={color => {
                            setValue(color);
                            onChange && onChange(color);
                            validateField(color);
                            setIsOpen(false);
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default ColorPicker;

const styles = {
    colorPicker: {
        flexDirection: 'row',
        maxWidth: 180,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: colors.formBorder,
        padding: 8,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    swatch: {
        width: 40,
        height: 22,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.formBorder,
    },

    popover: {
        // position: 'absolute',
        // zIndex: '2',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
};
