import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Icon } from './PlatformSpecificModules.web';
import MasterForm from '../index';
import { colors, textStyles, containerStyles } from '../styles';

export const rowIdKey = 'rowId';

const Button = ({ add = false, clone = false, containerStyles, buttonStyles, addRowText, ...props }) => {
    const [hover, setHover] = useState(false);

    return (
        <div
            style={{
                ...styles.button(add),
                ...containerStyles,
            }}
        >
            <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{ ...styles.squareButton(add || clone, hover), ...buttonStyles }}
                {...props}
            >
                {!clone && (
                    <Icon
                        name={add ? 'plus' : 'minus'}
                        style={{ fontSize: 14, marginLeft: add ? 5 : 0, color: colors.formBackground }}
                    />
                )}
                {(add || clone) && (
                    <div style={{ ...textStyles.button, paddingLeft: 5, paddingRight: 10, color: '#fff' }}>
                        {addRowText.toUpperCase()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ({ props, context }) => {
    const {
        name,
        label,
        rowElements,
        containerStyle,
        addRowText = 'add row',
        maxHeight = 500,
        children,
        disableAddButton,
        disableCloneButton,
        hideAddButton,
        showCloneButton,
        hideRemoveRowButtons,
        completelyRemovable,
        removeFromClone = [],
        noScroll = false,
    } = props;

    const {
        value = [],
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

    const [subFormState, setSubFormState] = useState(value || []);

    useEffect(() => {
        const valueJson = {};
        value &&
            value.map((item, index) => {
                valueJson[`${index}${name}`] = { ...(item || {}), [rowIdKey]: `${name}${index}` };
            });

        setSubFormState((prev) => ({ ...prev, ...valueJson }));
    }, []);

    useEffect(() => {
        //key example: 0name, 1name, 2name
        const toSetValue = Object.keys(subFormState)
            .filter((key) => key.includes(name) && key !== name && key !== rowIdKey)
            .map((key) => subFormState[key]);

        if (JSON.stringify(subFormState[name]) !== JSON.stringify(toSetValue)) setValue(toSetValue);
    }, [subFormState]);

    const addRow = () => {
        // set the value of subFormState, value will be updated by effect
        setSubFormState({ ...subFormState, [`${value.length}${name}`]: { [rowIdKey]: `${name}${value.length}` } });
    };

    const cloneRow = () => {
        // set the value of subFormState, value will be updated by effect
        let clonedRow = { [rowIdKey]: `${name}${value.length}` };
        Object.keys(subFormState[`${value.length - 1}${name}`]).map((item) => {
            if (!removeFromClone.includes(item))
                clonedRow = { [item]: subFormState[`${value.length - 1}${name}`][item], ...clonedRow };
        });

        setSubFormState({
            ...subFormState,
            [`${value.length}${name}`]: clonedRow,
        });
    };

    const removeRow = (index) => {
        const newValue = [...value.slice(0, index), ...value.slice(index + 1, value.length)];
        const newSubState = newValue.reduce(
            (obj, v, index) => ({ ...obj, [`${index}${name}`]: { ...v, [rowIdKey]: `${name}${index}` } }),
            {},
        );

        // set the value of subFormState, value will be updated by effect
        setSubFormState(newSubState);
    };

    const disabled = disableAddButton ? { backgroundColor: '#eee', borderColor: '#eee' } : {};

    return (
        <MasterForm.Section style={containerStyle}>
            {label && <Text style={containerStyles.formFieldLabel}>{label.toUpperCase()}</Text>}

            <MasterForm formState={subFormState} setFormState={setSubFormState}>
                <MasterForm.Section style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <MasterForm.Section
                        style={{
                            height: !noScroll ? maxHeight : undefined,
                            minHeight: 100,
                            overflow: !noScroll && 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}
                    >
                        {Array.isArray(value) &&
                            value.map((row, index) => (
                                <MasterForm.Section
                                    row
                                    key={index}
                                    name={`${index}${name}`}
                                    value={subFormState[`${index}${name}`]}
                                    style={{ display: 'flex', flex: 1 }}
                                >
                                    {rowElements(index, value.length)}
                                    {!hideRemoveRowButtons && (value.length > 1 || completelyRemovable) && (
                                        <Button
                                            addRowText={addRowText}
                                            containerStyles={{ marginRight: 10 }}
                                            onClick={() => removeRow(index)}
                                        />
                                    )}
                                </MasterForm.Section>
                            ))}
                        <MasterForm.Section row>
                            {!hideAddButton && (
                                <Button
                                    add
                                    addRowText={addRowText}
                                    buttonStyles={disabled}
                                    containerStyles={{ marginRight: 10 }}
                                    onClick={() => !disableAddButton && addRow()}
                                />
                            )}
                            {showCloneButton && (
                                <Button
                                    clone
                                    addRowText={'CLONE ABOVE ROW'}
                                    buttonStyles={disabled}
                                    onClick={() => !disableCloneButton && cloneRow()}
                                />
                            )}
                        </MasterForm.Section>
                        {children}
                    </MasterForm.Section>
                </MasterForm.Section>
            </MasterForm>

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}
        </MasterForm.Section>
    );
};

const styles = {
    squareButton: (add, hover) => {
        return {
            display: 'flex',
            cursor: 'pointer',
            width: add ? undefined : 25,
            height: 25,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: add ? (hover ? '#358201' : '#4ab601') : hover ? '#EB654F' : '#aaa',
            borderRadius: 25,
            marginTop: 10,
            marginBottom: 10,
            alignSelf: 'flex-start',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: add ? (hover ? '#358201' : '#4ab601') : hover ? '#EB654F' : '#aaa',
        };
    },

    button: (add) => {
        return {
            display: 'flex',
            flexDirection: add ? 'column' : 'row',
            alignSelf: add ? 'flex-start' : 'flex-end',
            marginLeft: 5,
        };
    },
};
