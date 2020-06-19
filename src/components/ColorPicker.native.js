import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { colors, textStyles, containerStyles } from '../styles';

const ColorPicker = ({ props, context }) => {
    // const {name, label, onChange, validators, containerStyle,} = props;
    // const {
    //     value, setValue,
    //     isError, setError,
    //     errorLabel, setErrorLabel,
    //     isFocused, setFocus,
    //     isValidating, setIsValidating,
    //     validateField,
    // } = context;
    //
    // const defaultColor = '#444';
    // const [isOpen, setIsOpen] = useState(false);
    //
    // return (
    //     <>
    //         <TouchableOpacity
    //             activeOpacity={1} onClick={() => setIsOpen(true)}
    //             style={[styles.colorPicker, containerStyle]}
    //         >
    //             <Text style={textStyles.input}>{label}</Text>
    //             <View style={[styles.swatch, {backgroundColor: value ? value.hex : defaultColor}]}/>
    //         </TouchableOpacity>
    //
    //         {isOpen && <View style={styles.popover}>
    //             <TouchableOpacity activeOpacity={1} onClick={() => setIsOpen(false)} style={styles.overlay}/>
    //
    //             <TwitterPicker
    //                 color={value || defaultColor}
    //                 onChange={(color) => {
    //                     setValue(color);
    //                     onChange && onChange(color);
    //                     setIsOpen(false);
    //                 }}
    //             />
    //         </View>}
    //     </>
    // );
    return null;
};
export default ColorPicker;

const styles = {
    colorPicker: {
        flexDirection: 'row',
        maxWidth: 180,
        borderWidth: 1,
        borderColor: colors.formBorder,
        borderRadius: 4,
        padding: 8,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    swatch: {
        width: 40,
        height: 22,
        borderRadius: 4,
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
        // backgroundColor: 'black',
        // opacity: 0.5,
    },
};
