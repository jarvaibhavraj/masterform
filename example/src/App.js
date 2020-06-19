import React, { useState } from 'react';

import MasterForm from '../../src';

const ExampleForm = () => {
    const [formState, setFormState] = useState();
    const sectionMargin = 30;

    return (
        <MasterForm formState={formState} setFormState={setFormState}>
            <MasterForm.Section style={{ marginTop: sectionMargin, marginBottom: 10 }} title={'PERSONAL DETAILS'} />
            <MasterForm.Section row>
                <MasterForm.TextInput
                    name={'firstName'}
                    label={'First Name'}
                    placeholder={'Arya'}
                    validators={[{ function: MasterForm.isRequired, errorLabel: 'Required field' }]}
                />
                <MasterForm.TextInput
                    name={'lastName'}
                    label={'Last Name'}
                    placeholder={'Stark'}
                    validators={[{ function: MasterForm.isRequired, errorLabel: 'Required field' }]}
                />
            </MasterForm.Section>

            <MasterForm.Section row>
                <MasterForm.DateTimePicker
                    name={'dateOfBirth'}
                    label={'DATE OF BIRTH'}
                    placeholder={'Select'}
                    validators={[{ function: MasterForm.isRequired, errorLabel: 'Required field' }]}
                />
                <MasterForm.Picker
                    name={'gender'}
                    label={'GENDER'}
                    placeholder={'Select'}
                    options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                    ]}
                    validators={[{ function: MasterForm.isRequired, errorLabel: 'Required field' }]}
                />
            </MasterForm.Section>

            <MasterForm.ImagePicker multiple name={'photos'} label={`Photos`} />

            <MasterForm.Section style={{ marginTop: sectionMargin, marginBottom: 10 }} title={'CONTACT INFORMATION'} />

            <MasterForm.Section row>
                <MasterForm.TextInput
                    disabled
                    name={'email'}
                    label={'Email'}
                    placeholder={'Disabled'}
                    containerStyle={{ width: 280 }}
                    validators={[{ function: MasterForm.isRequired, errorLabel: 'Required field' }]}
                />
                <MasterForm.TextInput
                    name={'phone'}
                    label={'Phone'}
                    startText={'+91'}
                    validators={[{ function: MasterForm.isRequired, errorLabel: 'Required field' }]}
                />
            </MasterForm.Section>

            <MasterForm.TextInput multiline numberOfLines={3} name={'address'} label={'Residential Address'} />

            <MasterForm.Section style={{ marginTop: sectionMargin, marginBottom: 10 }} title={'OTHER'}>
                <MasterForm.ColorPicker name={'color'} label={'Favorite Color'} />
                <MasterForm.PlaceInput name={'location'} label={'Location'} containerStyle={{ marginTop: 18 }} />
            </MasterForm.Section>

            <MasterForm.Section row style={{ marginTop: sectionMargin }}>
                <MasterForm.SubmitButton label={'SUBMIT'} />
                <MasterForm.SubmitButton noValidation label={'Cancel'} color={'white'} />
            </MasterForm.Section>
        </MasterForm>
    );
};

const App = () => {
    return (
        <div>
            <h1 style={{ margin: 20, fontFamily: 'sans-serif' }}>{'MasterForm Example'}</h1>

            <div style={{ margin: 20 }}>
                <ExampleForm />
            </div>
        </div>
    );
};

export default App;
