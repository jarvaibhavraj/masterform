import React, { useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
import MasterForm from '../index';

import { colors, textStyles, containerStyles } from '../styles';

// Picker dropdown renders below the next element if View is used on web
const PlatformDiv = (props) => {
    return Platform.OS === 'web' ? <div {...props} /> : <View {...props} />;
};

export default ({ props, context }) => {
    const { title, label, name, value, children, style, labelStyle, titleStyle, row } = props;
    const { value: internalValue, setValue } = context;

    const [subFormState, setSubFormState] = useState(internalValue || {});
    useEffect(() => {
        name && setValue(subFormState);
    }, [subFormState]);

    // This enables a controllable value for Section
    useEffect(() => {
        name &&
            value !== undefined &&
            (value
                ? JSON.stringify(value) !== JSON.stringify(internalValue) && setSubFormState(value)
                : setSubFormState({}));
    }, [value]);

    return (
        <PlatformDiv style={style}>
            {(label || title) && (
                <View style={styles.sectionTitleContainer}>
                    <Text
                        style={{
                            ...textStyles.section,
                            ...titleStyle,
                            ...labelStyle,
                        }}
                    >
                        {label || title}
                    </Text>

                    <View style={styles.sectionHorizontalStreak} />
                </View>
            )}
            <PlatformDiv style={row ? styles.rowStyle : {}}>
                {name ? (
                    <MasterForm formState={subFormState} setFormState={setSubFormState}>
                        {children}
                    </MasterForm>
                ) : (
                    children
                )}
            </PlatformDiv>
        </PlatformDiv>
    );
};

const styles = {
    rowStyle: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        margin: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    sectionHorizontalStreak: {
        flex: 1,
        height: 2,
        backgroundColor: colors.formBorder,
        marginLeft: 8,
        marginRight: 16,
    },
};
