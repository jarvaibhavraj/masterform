import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { colors, textStyles, containerStyles } from '../styles';

export default ({ props, context }) => {
    const [hover, setHover] = useState(false);
    const {
        name,
        label,
        placeholder,
        imageHeight,
        imageWidth,
        cropping,
        // multiple, // have to handle setting multiple images in value and their display first
        onChangeText,
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

    const pickerHeight = containerStyle && containerStyle.height ? containerStyle.height : 100;
    const pickerWidth = containerStyle && containerStyle.width ? containerStyle.width : 100;
    const borderRadius = containerStyle && containerStyle.borderRadius ? containerStyle.borderRadius : 5;
    return (
        <View>
            <Text style={containerStyles.formFieldLabel}>{label && label.toUpperCase()}</Text>

            <TouchableOpacity
                onPress={() =>
                    ImagePicker.openPicker({
                        height: imageHeight || 512,
                        width: imageWidth || 512,
                        cropping: cropping,
                        // multiple: multiple,
                        mediaType: 'photo',
                        compressImageMaxWidth: 1280,
                        compressImageMaxHeight: 720,
                        compressImageQuality: 0.8,
                    }).then(image => setValue(image.path))
                }
                style={{
                    height: pickerHeight,
                    width: pickerWidth,
                    borderRadius: borderRadius,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: isError ? colors.error : colors.formBorder,
                    ...containerStyle,
                }}
            >
                {value ? (
                    <Image source={{ uri: value }} style={{ height: pickerHeight, width: pickerWidth }} />
                ) : (
                    <Text> {placeholder || 'Select Image'}</Text>
                )}
            </TouchableOpacity>

            {isError && <Text style={containerStyles.formFieldErrorLabel}>{errorLabel}</Text>}
        </View>
    );
};
