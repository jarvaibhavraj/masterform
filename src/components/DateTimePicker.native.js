import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import MasterForm, { monthOptions } from './index';
import { colors, textStyles, containerStyles } from '../styles';

export default ({ props, context }) => {
    const {
        name,
        label,
        placeholder,
        disabled,
        compact,
        mode = 'date', // date, time, datetime, month
        pickMonthEndDate,
        minDate,
        maxDate,
        onChange,
        validators,
        containerStyle,
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

    const paddingHorizontal = !compact ? 8 : 4;
    const paddingVertical = !compact ? 8 : 4;

    const actualValue = props.value || value;
    const dateTimeFormat = mode === 'datetime' ? 'LLL' : mode === 'date' ? 'LL' : 'LT';

    const togglePicker = () => {
        if (disabled) return;
        isFocused ? setFocus(false) : setFocus(true);
    };

    return mode === 'month' ? (
        <MasterForm.Picker
            {...props}
            value={actualValue && moment(actualValue).month() + 1} // moment.month() starts at 0 for Jan
            options={monthOptions}
            onChange={value => {
                let toSetDate = moment(value, 'M');
                pickMonthEndDate ? toSetDate.endOf('month').add('years', 1) : toSetDate.startOf('month');
                setValue(toSetDate.format());
            }}
        />
    ) : (
        <TouchableOpacity
            activeOpacity={1}
            onPress={togglePicker}
            style={[containerStyles.formFieldContainer, compact && { minWidth: 50 }, containerStyle]}
        >
            <Text style={containerStyles.formFieldLabel}>{label && label.toUpperCase()}</Text>
            <View
                style={[
                    styles.dateTimePicker,
                    { paddingVertical: paddingVertical, paddingHorizontal: paddingHorizontal },
                    disabled && { borderColor: colors.disabled, backgroundColor: colors.disabled },
                    isError && containerStyles.formFieldErrorBorder,
                    isFocused && containerStyles.formFieldFocusBorder,
                ]}
            >
                <Text style={[styles.dateTimePickerText, !actualValue && { color: colors.formBorder }]}>
                    {(actualValue && moment(actualValue).format(dateTimeFormat)) || placeholder || 'Select'}
                </Text>
            </View>

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}

            <DateTimePicker
                is24Hour={false}
                minimumDate={minDate}
                maximumDate={maxDate}
                {...props}
                mode={mode}
                isVisible={isFocused}
                onConfirm={datetime => {
                    const toSetValue = moment(datetime).toISOString();
                    setValue(toSetValue);
                    onChange && onChange(toSetValue);
                    validateField(toSetValue);

                    togglePicker();
                }}
                onCancel={togglePicker}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dateTimePicker: {
        ...textStyles.input,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.formBorder,
        // backgroundColor: 'blue',
    },
    dateTimePickerText: {
        ...textStyles.input,
        color: colors.input,
        // backgroundColor: 'cyan',
    },
});
