import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import MasterForm from '../index';

import { colors, textStyles, containerStyles } from '../styles';

export default ({ props, context }) => {
    const {
        name,
        multiple,
        noUncheck,
        label,
        disabled,
        validators,
        onChange,
        containerStyle,
        row,
        options = [],
        optionContainerStyle,
        color,
    } = props;

    const {
        value,
        setValue,
        formState,
        setFormState,
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

    const initialState = multiple
        ? (value || []).reduce((obj, key) => ({ ...obj, [key]: true }), {})
        : (value && { [value]: true }) || {};

    const [subFormState, setSubFormState] = useState(initialState);
    useEffect(() => {
        const selectedCheckBoxes = Object.keys(subFormState).filter((key) => subFormState[key]);
        const toSetValue = multiple ? selectedCheckBoxes : selectedCheckBoxes[0] || null; // Set null if undefined
        setValue(toSetValue);
        onChange && onChange(toSetValue);
    }, [subFormState]);

    const setGroupValue = (option, isSelected) => {
        !multiple && setSubFormState({ [option]: isSelected }); // If not multiple then uncheck other boxes
    };

    return (
        <View style={[containerStyles.formFieldContainer, { minWidth: 50 }, containerStyle]}>
            {label && <Text style={containerStyles.formFieldLabel}>{label && label.toUpperCase()}</Text>}

            <View
                style={[
                    isFocused && containerStyles.formFieldFocusBorder,
                    disabled && { backgroundColor: colors.disabled },
                    isError && containerStyles.formFieldErrorBorder,
                    row && {
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    },
                ]}
                {...props}
            >
                <MasterForm formState={subFormState} setFormState={setSubFormState}>
                    {options.map((option) => (
                        <MasterForm.CheckBox
                            key={option.value || option}
                            name={option.value || option}
                            label={option.label || option}
                            color={color}
                            radio={!multiple}
                            noUncheck={noUncheck}
                            value={
                                multiple
                                    ? (value || []).includes(option.value || option)
                                    : value === (option.value || option)
                            }
                            onChange={(value) => setGroupValue(option.value || option, value)}
                            containerStyle={optionContainerStyle}
                        />
                    ))}
                </MasterForm>
            </View>
        </View>
    );
};
