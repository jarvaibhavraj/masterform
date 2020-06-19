import React from 'react';
import { Text } from 'react-native';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

import { colors, textStyles, containerStyles } from '../styles';

const animatedComponents = makeAnimated();

const Picker = ({ props, context }) => {
    const {
        name,
        label,
        disabled,
        isSearchable,
        isMulti,
        enableSelectAll,
        allOption,
        options = [],
        onChange,
        containerStyle,
        formFieldStyle,
        formFieldInputStyle,
        formFieldLabelStyle,
        menuListMaxHeight = 200,
        multiValueContainerColor = '#7611B2',
        loadAsyncOptions,
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
        formFieldState,
        formFieldStateSetter,
        validateField,
    } = context;
    const actualValue = props.value || value;

    const selectAllOption = allOption || { label: 'Select All', value: '*' };
    const showSelectAll =
        isMulti && enableSelectAll && options && options[0] && (!actualValue || actualValue.length !== options.length);
    const actualOptions = showSelectAll ? [selectAllOption, ...options] : options;

    const isMobile = window && window.innerWidth < 800;

    const customPickerStyles = {
        menuList: (provided, state) => ({
            ...provided,
            maxHeight: menuListMaxHeight,
            borderRadius: 0,
        }),
        container: (provided, state) => ({
            ...provided,
            cursor: 'pointer',
        }),

        input: (provided, state) => ({
            ...provided,
            padding: 0,
            margin: 0,
        }),
        multiValue: styles => {
            return {
                ...styles,
                borderRadius: 5,
                backgroundColor: '#eee',
            };
        },
        multiValueLabel: styles => ({
            ...styles,
            fontSize: 14,
        }),
        valueContainer: (provided, state) => ({
            ...textStyles.input,
            ...provided,
            padding: 8,
            margin: 0,
            paddingLeft: 16,
            paddingRight: 16,
            ...formFieldInputStyle,
        }),
        singleValue: provided => ({ ...provided, color: 'none' }), // to use color from formFieldInputStyle
        option: (provided, state) => ({
            ...textStyles.input,
            outline: 'none',
            color: state.isFocused ? colors.input : '#aaa',
            backgroundColor: state.isFocused ? '#eee' : null,
            padding: 8,
            paddingLeft: 16,
            paddingRight: 16,
            // ...formFieldInputStyle,
        }),
        control: (provided, state) => ({
            ...textStyles.input,
            ...provided,
            borderRadius: 5,
            outline: state.isFocused ? 'none' : null,
            '&:hover': {
                borderColor: state.isFocused ? '#ddd' : '#aaa',
            },
            padding: 0,
            margin: 0,
            cursor: 'text',
            borderColor: isError ? colors.error : colors.formBorder,
            boxShadow: state.isFocused ? '1px 2px 3px #ddd' : null,
            ...formFieldStyle,
        }),
        multiValueRemove: styles => ({
            ...styles,
            color: multiValueContainerColor,
            ':hover': {
                cursor: 'pointer',
                backgroundColor: multiValueContainerColor,
                color: 'white',
            },
        }),
    };

    return (
        <div id={name} style={{ ...containerStyles.formFieldContainer, ...containerStyle }}>
            <div style={{ ...containerStyles.formFieldLabel, ...formFieldLabelStyle }}>
                {label && label.toUpperCase()}
            </div>
            <AsyncSelect
                isDisabled={disabled}
                placeholder={'. . .'}
                closeMenuOnSelect={!isMulti}
                isSearchable={isSearchable !== undefined ? isSearchable : !!loadAsyncOptions || !isMobile}
                // components={animatedComponents} //Does not let container expand when multi select
                {...props}
                cacheOptions
                defaultOptions={actualOptions}
                loadOptions={
                    loadAsyncOptions
                        ? (inputValue, callback) => loadAsyncOptions(inputValue, callback)
                        : (inputValue, callback) => {
                              callback(
                                  actualOptions.filter(item =>
                                      item.label.toLowerCase().includes(inputValue.toLowerCase()),
                                  ),
                              );
                          }
                }
                value={
                    options &&
                    (!isMulti
                        ? options.find(option => JSON.stringify(option.value) === JSON.stringify(actualValue))
                        : options.filter(
                              option =>
                                  actualValue &&
                                  actualValue.find(
                                      item =>
                                          JSON.stringify(item.value) === JSON.stringify(option.value) ||
                                          (option.data && item.id === option.data.id) ||
                                          (option.value.id && item.id === option.value.id) ||
                                          item.id === option.value ||
                                          JSON.stringify(item) === JSON.stringify(option.value),
                                  ),
                          ) || {})
                }
                onChange={value => {
                    const toSetValue =
                        value &&
                        (isMulti && value.length > 0
                            ? value.find(item => item.value === selectAllOption.value)
                                ? options.map(item => item.value)
                                : value.map(item => item.value)
                            : value.value);

                    setValue(toSetValue);
                    validateField(toSetValue);
                    onChange && onChange(toSetValue);
                }}
                styles={customPickerStyles}
            />

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}
        </div>
    );
};

export default Picker;
