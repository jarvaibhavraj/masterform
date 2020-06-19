import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FormFieldSpinner } from './index';

import { colors, textStyles, containerStyles } from '../styles';

const Picker = ({ props, context }) => {
    const pickerRef = React.createRef();
    const { name, label, placeholder, disabled, onPickValue, onChange, validators, options, containerStyle } = props;
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
        formFieldState,
        formFieldStateSetter,
        measurements,
        validateField,
    } = context;

    const screenHeight = Dimensions.get('window').height;
    const optionsMeasurements = measurements || {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
    };
    const setOptionsMeasurements = value => formFieldStateSetter('measurements', value);

    const actualValue = props.value || value;
    const selectedLabel = (options.find(option => option.value === actualValue) || {}).label;

    const measurePickerOptions = () => {
        pickerRef.current.measureInWindow((x, y, width, height, pageX, pageY) =>
            setOptionsMeasurements({ x, y, width, height }),
        );
        return true;
    };

    const togglePicker = () => {
        if (disabled) return;
        isFocused ? setFocus(false) : measurePickerOptions() && setFocus(true);
    };

    const renderPickerOption = option => {
        const isSelectedOption = option.label === selectedLabel;
        return (
            <TouchableOpacity
                onPress={() => {
                    setValue(option.value);
                    setError(false);
                    validateField(option.value);
                    onPickValue && onPickValue(option.value);
                    onChange && onChange(option.value);

                    togglePicker();
                }}
                style={[styles.pickerOptionButton, isSelectedOption && { backgroundColor: colors.formSecondary }]}
            >
                <Text style={[styles.pickerOptionText, isSelectedOption && { color: colors.formBackground }]}>
                    {option.label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={togglePicker}
            style={[containerStyles.formFieldContainer, containerStyle]}
        >
            <Text style={containerStyles.formFieldLabel}>{label && label.toUpperCase()}</Text>
            <View
                ref={pickerRef}
                style={[
                    styles.pickerContainer,
                    disabled && { borderColor: colors.disabled, backgroundColor: colors.disabled },
                    isError && containerStyles.formFieldErrorBorder,
                    isFocused && containerStyles.formFieldFocusBorder,
                ]}
            >
                <Text style={[styles.pickerText, !selectedLabel && { color: colors.formBorder }]}>
                    {selectedLabel || placeholder || 'Select'}
                </Text>

                {isValidating && <FormFieldSpinner />}
                <Icon name="chevron-down" style={styles.pickerArrow} />
            </View>

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}

            <Modal visible={isFocused} transparent={true} hardwareAccelerated={true} onRequestClose={togglePicker}>
                <TouchableOpacity activeOpacity={1} onPress={togglePicker} style={styles.pickerOptionsOverlay}>
                    <View
                        style={{
                            ...containerStyles.formFieldFocusBorder,
                            left: optionsMeasurements.x,
                            top: optionsMeasurements.y + optionsMeasurements.height,
                            width: optionsMeasurements.width,
                            maxHeight:
                                optionsMeasurements.y + 300 < screenHeight
                                    ? 300
                                    : screenHeight - optionsMeasurements.y - optionsMeasurements.height * 2,
                            marginTop: 5,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: colors.formBorder,
                            backgroundColor: colors.formBackground,
                        }}
                    >
                        <ScrollView style={{ marginBottom: 10 }}>{options.map(renderPickerOption)}</ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </TouchableOpacity>
    );
};

export default Picker;

const styles = StyleSheet.create({
    pickerContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.formBorder,
        borderRadius: 5,
        padding: 4,
        paddingLeft: 12,
        paddingRight: 8,
        alignItems: 'center',
        // backgroundColor: 'cyan',
    },
    pickerText: {
        ...textStyles.input,
        flex: 1,
        color: colors.input,
        // backgroundColor: 'cyan',
    },
    pickerArrow: {
        fontSize: 24,
        color: colors.formBorder,
        marginLeft: 5,
        marginRight: -5,
    },
    pickerOptionsOverlay: {
        ...StyleSheet.absoluteFill,
        // backgroundColor: '#0002',
    },
    pickerOptionsContainer: {
        // ...masterFormStyles.formFieldFocusBorder,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: colors.formBorder,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingRight: 20,
        paddingBottom: 20,
        backgroundColor: colors.formBackground,
    },
    pickerOptionButton: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 10,
        // paddingBottom: 8,
        // backgroundColor: 'cyan',
        // alignItems: 'flex-end',
    },
    pickerOptionText: {
        ...textStyles.input,
        flex: 1,
        padding: 0,
        // textAlign: 'right',
        color: colors.formPrimary,
    },
});
