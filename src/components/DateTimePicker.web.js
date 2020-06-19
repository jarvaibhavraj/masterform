import React from 'react';
import { Text, View } from 'react-native';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import 'flatpickr/dist/themes/airbnb.css';

import MasterForm, { monthOptions } from '../index';
import { colors, textStyles, containerStyles } from '../styles';

const DateTimePicker = ({ props, context }) => {
    const {
        name,
        label,
        compact,
        mode = 'date', // date, time, datetime, month
        pickMonthEndDate,
        minDate,
        maxDate,
        onChange,
        validators,
        containerStyle,
        formFieldStyle,
        formFieldInputStyle,
        formFieldLabelStyle,
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

    const paddingHorizontal = !compact ? 16 : 8;
    const paddingVertical = !compact ? 8 : 4;

    const actualValue = props.value || value;
    const dateTimeFormat = mode === 'datetime' ? 'F j, Y h:i K' : mode === 'date' ? 'F j, Y' : 'h:i K';

    return mode === 'month' ? (
        <MasterForm.Picker
            {...props}
            value={actualValue && moment(actualValue).month() + 1} // moment.month() starts at 0 for Jan
            options={monthOptions}
            onChange={(value) => {
                let toSetDate = moment(value, 'M');
                pickMonthEndDate ? toSetDate.endOf('month').add('years', 1) : toSetDate.startOf('month');
                setValue(toSetDate.format());
            }}
        />
    ) : (
        <View style={[containerStyles.formFieldContainer, compact && { minWidth: 50 }, containerStyle]}>
            <Text style={[containerStyles.formFieldLabel, formFieldLabelStyle]}>{label && label.toUpperCase()}</Text>

            <Flatpickr
                id={name}
                placeholder={'. . .'}
                style={{
                    ...styles.dateTimePicker,
                    padding: paddingVertical,
                    paddingLeft: paddingHorizontal,
                    paddingRight: paddingHorizontal,
                    borderColor: isError ? colors.error : colors.formBorder,
                    ...formFieldStyle,
                    ...formFieldInputStyle,
                }}
                {...props}
                value={actualValue && moment(actualValue).toISOString()}
                onChange={(datetime) => {
                    const toSetValue = moment(datetime[0]).toISOString();

                    setValue(toSetValue);
                    onChange && onChange(toSetValue);
                    validateField(toSetValue);
                }}
                options={{
                    // altInput: true,
                    dateFormat: dateTimeFormat,
                    noCalendar: mode === 'time',
                    enableTime: mode === 'datetime' || mode === 'time',
                    minDate: minDate,
                    maxDate: maxDate,
                    ...props.options,
                }}
            />

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}
        </View>
    );
};
export default DateTimePicker;

const styles = {
    dateTimePicker: {
        ...textStyles.input,
        // outline: 'none',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        // backgroundColor: 'blue',
    },
};
