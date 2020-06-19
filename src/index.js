import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';

import './index.css';

import TextInput from './components/TextInput';
import FileInput from './components/FileInput';
import ImagePicker from './components/ImagePicker';
import Picker from './components/Picker';
import ColorPicker from './components/ColorPicker';
import DateTimePicker from './components/DateTimePicker';
import PlaceInput from './components/PlaceInput';
import Section from './components/Section';
import SubmitButton from './components/SubmitButton';
import RepeatingRow from './components/RepeatingRow';
import CheckBox from './components/CheckBox';
import CheckBoxGroup from './components/CheckBoxGroup';

import { colors, containerStyles } from './styles';

export const MasterFormContext = React.createContext({});

export const monthOptions = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
];

export const FormFieldSpinner = ({ color, style }) => {
    return (
        <ActivityIndicator
            // animating={props.animating}
            size="small"
            color={color || colors.formPrimary}
            style={style}
        />
    );
};

const formFieldEqualityCheck = (prev, next) => {
    const { formState, formFieldProps, ...prevContext } = prev.context;
    const { formState: formState1, formFieldProps: formFieldProps1, ...nextContext } = next.context;

    const { children, ...prevProps } = prev.props;
    const { children: children1, ...nextProps } = next.props;

    return (
        JSON.stringify(prevContext) === JSON.stringify(nextContext) &&
        JSON.stringify(prevProps) === JSON.stringify(nextProps)
    );
};

const withFormFieldContext = (formField, type) => {
    return (formFieldProps) => (
        <MasterFormContext.Consumer>
            {(context) => {
                const { registerFormField, getFormFieldContext } = context;
                const { name, validators, onPress, onClick } = formFieldProps;

                let nonNullName =
                    name || ((onPress || onClick) && 'masterFormSubmitButton') || 'masterFormGenericField';

                const formFieldContext = getFormFieldContext(nonNullName);

                if (!formFieldContext) {
                    registerFormField(nonNullName, validators, formFieldProps).then(null);
                    return null;
                } else {
                    return (
                        <MasterFormField
                            formField={formField}
                            props={formFieldProps}
                            context={formFieldContext}
                            type={type}
                        />
                    );
                }
            }}
        </MasterFormContext.Consumer>
    );
};

const NonLazyFormField = ({ formField: FormField, props, context }) => {
    useEffect(() => {
        // Form fields automatically deregister on unmount
        return context && context.deregisterFormField;
    }, []);

    const label =
        props.label &&
        Array.isArray(props.validators) &&
        props.validators.find((v) => v.errorLabel && v.errorLabel.toLowerCase().includes('required'))
            ? `${props.label} *`
            : props.label;

    return <FormField props={{ ...props, label }} context={context} />;
};

const LazyFormField = React.memo(NonLazyFormField, formFieldEqualityCheck);

const MasterFormField = (stuff) => {
    // These field types use formState which is not updated in LazyFormField
    const { lazy = !['PaymentInput', 'Section', 'SubmitButton', 'BedPicker'].includes(stuff.type) } = stuff.props;
    return lazy ? <LazyFormField {...stuff} /> : <NonLazyFormField {...stuff} />;
};

export const getFieldName = (field) =>
    (field && field.name) ||
    (field && field.label && field.label.replace(/-|\s/g, '_').toLowerCase()) || // Pin Code -> pin_code
    'masterFormNamelessField';

export const MasterFormFieldsRenderer = ({ fields, noValidation }) => {
    const fieldsArray =
        fields &&
        fields
            .map((f) => ({
                ...f,
                name: getFieldName(f),
                multiline: f.isMulti,
                numberOfLines: f.isMulti ? 3 : 1,
                validators:
                    !noValidation && f.isRequired
                        ? [{ function: 'isRequired', errorLabel: `${f.label} is required` }]
                        : [],
                style: f.type === 'Section' ? { marginTop: 50, marginBottom: 20 } : {},
                containerStyle: f.type === 'ImagePicker' ? { height: 200, width: 250 } : { marginBottom: 10 },
            }))
            .filter((f) => f.type && f.name);

    // const [formState, setFormState] = useState(
    //     fields && fieldsArray.reduce((obj, f) => ({ ...obj, [f.name]: data[f.name] }), {}),
    // );
    //
    // useEffect(() => setData && setData(formState), [formState]);

    return (
        !!fields &&
        fieldsArray.map((f) => {
            const Component = MasterForm[f.type];
            return (
                <Component
                    {...f}
                    key={f.name}
                    validators={f.validators.map((v) => ({
                        function: MasterForm[v.function],
                        errorLabel: v.errorLabel,
                    }))}
                />
            );
        })
    );
};

export default class MasterForm extends React.PureComponent {
    static Section = withFormFieldContext(Section, 'Section');
    static TextInput = withFormFieldContext(TextInput, 'TextInput');
    static FileInput = withFormFieldContext(FileInput, 'FileInput');
    static Picker = withFormFieldContext(Picker, 'Picker');
    static ImagePicker = withFormFieldContext(ImagePicker, 'ImagePicker');
    static ColorPicker = withFormFieldContext(ColorPicker, 'ColorPicker');
    static DateTimePicker = withFormFieldContext(DateTimePicker, 'DateTimePicker');
    static CheckBox = withFormFieldContext(CheckBox, 'CheckBox');
    static CheckBoxGroup = withFormFieldContext(CheckBoxGroup, 'CheckBoxGroup');
    static PlaceInput = withFormFieldContext(PlaceInput, 'PlaceInput');
    static SubmitButton = withFormFieldContext(SubmitButton, 'SubmitButton');
    static RepeatingRow = withFormFieldContext(RepeatingRow, 'RepeatingRow');

    static isRequiredNonZero = (value) => value;
    static isRequired = (value) => value !== undefined && value !== null;
    static minLength = (min) => (value) => value && value.length >= min;
    static maxLength = (max) => (value) => value && value.length <= max;
    static noSpace = (str) => !/\s/g.test(str);

    setFormFieldAttribute = (formFieldName, attributeName, value) => {
        return new Promise((resolve) =>
            this.setState(
                (previousState) => ({
                    [formFieldName]: {
                        ...previousState[formFieldName],
                        [attributeName]: value,
                    },
                }),
                resolve,
            ),
        );
    };

    registerFormField = async (name, validators, formFieldProps) => {
        const { formState = {}, formStateSetter, setFormState } = this.props;
        const setKeyValue = setFormState
            ? (key, value) => setFormState((prevState) => ({ ...prevState, [key]: value }))
            : formStateSetter;

        await this.setState((prevState) => ({
            [name]: {
                name: name,
                validators: validators,
                validateField: (value, formState) => this.validateField(name, value),

                formState: formState,
                setFormState: setFormState,
                validateAllFields: this.validateAllFields,

                formFieldProps: formFieldProps,
                // formFieldState: this.state[name], // Hazardous! Recursively fills up the state
                formFieldStateSetter: async (key, value) => await this.setFormFieldAttribute(name, key, value),

                value: formState[name],
                setValue: async (value) => {
                    await Promise.all([setKeyValue(name, value), this.setFormFieldAttribute(name, 'value', value)]);
                },

                isError: false,
                errorLabel: '',
                isFocused: false,
                isValidating: prevState[name] && prevState[name].isValidating,
                setError: async (value) => await this.setFormFieldAttribute(name, 'isError', value),
                setErrorLabel: async (value) => await this.setFormFieldAttribute(name, 'errorLabel', value),
                setFocus: async (value) => await this.setFormFieldAttribute(name, 'isFocused', value),
                setIsValidating: async (value) => await this.setFormFieldAttribute(name, 'isValidating', value),

                deregisterFormField: () =>
                    this.setState((prevState) => {
                        const tempState = { ...prevState };
                        delete tempState[name];
                        return tempState;
                    }),
            },
        }));
    };

    getFormFieldContext = (name) => {
        return this.state[name];
    };

    validateField = async (name, currentValue) => {
        const { value, validators, setError, setErrorLabel, setIsValidating, formFieldProps } = this.state[name];

        const { startText } = formFieldProps || {};
        let valueWithoutStartText =
            value && startText && value.startsWith(startText) ? value.replace(startText, '') : value;
        if (valueWithoutStartText === '') valueWithoutStartText = null;

        let valueToCheck =
            currentValue !== undefined ? currentValue : startText ? valueWithoutStartText : this.state[name].value;

        if (!validators) {
            return true;
        }
        setError(false);
        // name === 'phone' && console.log('loggin', valueToCheck, currentValue, valueWithoutStartText);

        const validatorPromises = validators.map(async (validator) => ({
            isError: !(await validator.function(valueToCheck, this.props.formState)),
            errorLabel: validator.errorLabel,
        }));

        setIsValidating(true);

        const validatorResults = await Promise.all(validatorPromises);
        const validatorWithError = validatorResults.find((result) => result.isError === true);
        if (validatorWithError) {
            setError(true);
            setErrorLabel(validatorWithError.errorLabel);
        }
        setIsValidating(false);

        // Value of validatorWithError is undefined if no error
        // Return true if no error
        return !validatorWithError;
    };

    validateAllFields = async () => {
        const fieldValidationPromises = Object.values(this.state).map(
            async (formField) => await formField.validateField(),
        );
        const fieldValidationResults = await Promise.all(fieldValidationPromises);

        const fieldWithError = fieldValidationResults.find((isValidField) => isValidField === false);
        // fieldWithError will be false if a form field with error is found
        // It will be undefined if no errors in the form
        return fieldWithError === undefined;
    };

    state = {
        /**
         * All form field children register in state with the attributes set in registerFormField function
         */
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // This is to update values in state of MasterForm whenever values of any fields change
        if (this.props !== prevProps) {
            let tempState = { ...this.state };
            Object.values(tempState).map((formField) => {
                this.registerFormField(formField.name, formField.validators, formField.formFieldProps).then(null);
            });
        }
    }

    render() {
        return (
            <MasterFormContext.Provider
                value={{
                    // Do not move this in state because these values have to update with each render
                    registerFormField: this.registerFormField,
                    getFormFieldContext: this.getFormFieldContext,
                }}
            >
                {Platform.OS === 'web' ? (
                    this.props.children
                ) : (
                    <View style={this.props.style}>{this.props.children}</View>
                )}
            </MasterFormContext.Provider>
        );
    }
}
