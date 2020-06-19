# MasterForm

Plug and play form library for React/React Native

**WARNING - Not production ready yet**

---

## Installation

Use npm

```
npm install masterform
```

or yarn

```
yarn add masterform
```

## Features

-   Supports both React and React Native
-   Plug and play form building
-   Form validation
-   External form state management

## Usage

```js
import React, { useState } from 'react';
import MasterForm from 'masterform';

const Form = () => {
    const [formState, setFormState] = useState({
        username: 'Mark', // keys in formState are from the name prop
        birthday: null, // passed to the different form fields
    });

    return (
        <MasterForm formState={formState} setFormState={setFormState}>
            <MasterForm.TextInput name={'username'} label={'Username'} />

            <div>
                {'Display anything in between form fields'}

                <MasterForm.DateTimePicker name={'birthday'} label={'Birthday'} />
            </div>
        </MasterForm>
    );
};

export default Form;
```

## MasterForm

| Prop         | Required | Description                     |
| ------------ | -------- | ------------------------------- |
| formState    | Yes      | State variable from useState    |
| setFormState | Yes      | Update function from useState   |
| children     | No       | Can have any arbitrary children |

## Available Fields

-   [TextInput](#textinput)
-   [Picker](#picker)
-   [CheckBox](#checkbox)
-   [CheckBoxGroup](#checkboxgroup)
-   [DateTimePicker](#datetimepicker)
-   [FileInput](#fileinput)
-   [ImagePicker](#imagepicker)
-   [ColorPicker](#colorpicker)
-   [PlaceInput](#placeinput)
-   [Section](#section)
-   [RepeatingRow](#repeatingrow)
-   [SubmitButton](#submitbutton)

## TextInput

| Prop           | Required | Default                                       | Description                                      |
| -------------- | -------- | --------------------------------------------- | ------------------------------------------------ |
| name           | Yes      |                                               | Name of the field. Used as key in the form state |
| label          | No       | `null`                                        | Label shown above the field                      |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty          |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                 |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)          |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                     |

## Picker

| Prop           | Required | Default                                       | Description                                                                                  |
| -------------- | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| name           | Yes      |                                               | Name of the field. Used as key in the form state                                             |
| label          | No       | `null`                                        | Label shown above the field                                                                  |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty                                                      |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                                                             |
| options        | No       | `[]`                                          | Array of labels and values <br><br> `[ {label: 'A', value: 'a'}, {label: 'B', value: 'b'} ]` |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)                                                      |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                                                                 |

## CheckBox

| Prop           | Required | Default                                       | Description                                      |
| -------------- | -------- | --------------------------------------------- | ------------------------------------------------ |
| name           | Yes      |                                               | Name of the field. Used as key in the form state |
| label          | No       | `null`                                        | Label shown above the field                      |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty          |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                 |
| radio          | No       | `false`                                       | Act as a radio button instead of a checkbox      |
| noUncheck      | No       | `false`                                       | Can the box be unticked?                         |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)          |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                     |

## CheckBoxGroup

CheckboxGroup controls multiple CheckBoxes as a group so that only one can be ticked.

| Prop           | Required | Default                                       | Description                                                                                  |
| -------------- | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| name           | Yes      |                                               | Name of the field. Used as key in the form state                                             |
| label          | No       | `null`                                        | Label shown above the field                                                                  |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty                                                      |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                                                             |
| multiple       | No       | `false`                                       | Can tick multiple boxes                                                                      |
| noUncheck      | No       | `false`                                       | Can the boxes be unticked?                                                                   |
| options        | No       | `[]`                                          | Array of labels and values <br><br> `[ {label: 'A', value: 'a'}, {label: 'B', value: 'b'} ]` |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)                                                      |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                                                                 |

## DateTimePicker

| Prop           | Required | Default                                       | Description                                      |
| -------------- | -------- | --------------------------------------------- | ------------------------------------------------ |
| name           | Yes      |                                               | Name of the field. Used as key in the form state |
| label          | No       | `null`                                        | Label shown above the field                      |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty          |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                 |
| mode           | No       | `date`                                        | `date`, `time`, `datetime`, `month`              |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)          |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                     |

## FileInput

| Prop           | Required | Default                                       | Description                                              |
| -------------- | -------- | --------------------------------------------- | -------------------------------------------------------- |
| name           | Yes      |                                               | Name of the field. Used as key in the form state         |
| label          | No       | `null`                                        | Label shown above the field                              |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty                  |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                         |
| multiple       | No       | `null`                                        | Pick multiple files                                      |
| type           | No       | `null`                                        | Type of file to pick <br> `null`, `image`, `spreadsheet` |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)                  |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                             |

## ImagePicker

| Prop           | Required | Default                                       | Description                                      |
| -------------- | -------- | --------------------------------------------- | ------------------------------------------------ |
| name           | Yes      |                                               | Name of the field. Used as key in the form state |
| label          | No       | `null`                                        | Label shown above the field                      |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty          |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                 |
| multiple       | No       | `null`                                        | Pick multiple images                             |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)          |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                     |

## ColorPicker

| Prop           | Required | Default                                       | Description                                      |
| -------------- | -------- | --------------------------------------------- | ------------------------------------------------ |
| name           | Yes      |                                               | Name of the field. Used as key in the form state |
| label          | No       | `null`                                        | Label shown above the field                      |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                 |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)          |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                     |

## PlaceInput

| Prop           | Required | Default                                       | Description                                      |
| -------------- | -------- | --------------------------------------------- | ------------------------------------------------ |
| name           | Yes      |                                               | Name of the field. Used as key in the form state |
| label          | No       | `null`                                        | Label shown above the field                      |
| placeholder    | No       | `null`                                        | Placeholder content when field is empty          |
| disabled       | No       | `false`                                       | Is field disabled (not editable)                 |
| mode           | No       | `map`                                         | `map`, `text`                                    |
| validators     | No       | `[]`                                          | [See form validation](#form-validation)          |
| containerStyle | No       | `{ minWidth: 200, maxWidth: 410, margin: 4 }` | Style of the field container                     |

## Section

A section can contain other form fields as children. Use this to divide a large form into sections for a cleaner UI.

| Prop       | Required | Default | Description                                                                                                                 |
| ---------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| name       | No       | `null`  | If supplied, form fields within the section will store their values in a JSON key with this name, inside the main formState |
| value      | No       | `{}`    | If name is supplied, form fields within the section will use this JSON for their initial values                             |
| title      | No       | `null`  | Title of the section                                                                                                        |
| label      | No       | `null`  | Alternative to title                                                                                                        |
| disabled   | No       | `false` | Is field disabled (not editable)                                                                                            |
| style      | No       | `{}`    | Style of the section container                                                                                              |
| titleStyle | No       | `{}`    | Style of the section title                                                                                                  |
| labelStyle | No       | `{}`    | Style of the section label                                                                                                  |

## RepeatingRow

TODO

## SubmitButton

A round button that validates all form fields when clicked. `onClick` is only called when all fields are valid.

| Prop           | Required | Default                    | Description                                                                         |
| -------------- | -------- | -------------------------- | ----------------------------------------------------------------------------------- |
| name           | No       | `'masterFormSubmitButton'` | Name of the field. Used as key in the form state                                    |
| label          | No       | `'SUBMIT'`                 | Label of the button                                                                 |
| disabled       | No       | `false`                    | Is field disabled (not editable)                                                    |
| onClick        | No       | `null`                     | Function receives `formState`, `areAllFieldsValid` and `validateAllFields` function |
| onPress        | No       | `null`                     | Alternative to onClick                                                              |
| noValidation   | No       | `false`                    | Call onClick without any validation                                                 |
| skipValidation | No       | `false`                    | Call onClick but do validation also                                                 |
| color          | No       | `'orange'`                 | `red`, `orange`, `green`, `blue`, `purple`, `white`, `gray`, `black`                |
| inverted       | No       | `false`                    | Switch button and label colors                                                      |
| style          | No       | `{}`                       | Style of the button                                                                 |
| labelStyle     | No       | `{}`                       | Style of the button label                                                           |

## Form validation

Each field has `validators` prop which is an array of validation functions and their corresponding error messages.

```js
validators = [
    {
        function: (value, formState) => value.length >= 10, // error is displayed if this returns false
        errorLabel: 'At least 10 characters are required',
    },
];
```

Each `function` receives the current value of the field and the complete formState. If the function returns **false**, the `errorLabel` is displayed below the field.

##

[![License: MIT](https://img.shields.io/github/license/jarvaibhavraj/masterform?style=for-the-badge)](https://opensource.org/licenses/MIT)
