import React, { useEffect, useState } from 'react';
import FlexView from 'react-flexview';
import XLSX from 'xlsx';

import { Lightbox, Icon } from './PlatformSpecificModules.web';
import { rowIdKey } from './RepeatingRow';
import { colors, containerStyles, textStyles } from '../styles';

export default ({ props, context }) => {
    const { name, label, placeholder, multiple, type, onChange, validators, containerStyle, style } = props;
    const {
        value = multiple ? [] : null,
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
        formState,
    } = context;

    const [files, setFiles] = useState([]);
    const [expand, setExpand] = useState(null);
    console.log('images expand', expand);

    // rowIdKey is supplied by RepeatingRow
    // Fix for cases when multiple FileInputs with same name are present
    const id = name + (formState[rowIdKey] || '');
    const isImage = type === 'image';
    const isSpreadsheet = type === 'spreadsheet';

    const removeImage = (index) => {
        let images = multiple ? [...value.slice(0, index), ...value.slice(index + 1, value.length)] : null;
        setValue(images);
    };

    const Images = () => {
        const photos = value ? (Array.isArray(value) ? value : [value]) : [];

        return (
            <FlexView hAlignContent={'left'} grow wrap style={{ ...styles.mainImageContainer, ...style }}>
                {photos.map((image, index) => (
                    <FlexView key={index} style={{ padding: 10, border: '1px solid #ddd' }}>
                        <FlexView style={styles.imageContainer}>
                            <img
                                onClick={() => setExpand(image)}
                                src={image}
                                style={{ minHeight: 20, maxHeight: 120 }}
                            />
                            <FlexView style={styles.deleteButton} onClick={() => removeImage(index)}>
                                <Icon name={'delete-forever'} style={{ color: 'tomato', fontSize: 20 }} />
                            </FlexView>
                        </FlexView>
                    </FlexView>
                ))}

                {/*<Lightbox*/}
                {/*    isOpen={expand !== null}*/}
                {/*    initialIndex={photos.indexOf(expand)}*/}
                {/*    images={photos}*/}
                {/*    onClose={() => setExpand(null)}*/}
                {/*/>*/}

                {(multiple || photos.length === 0) && <FileName />}
            </FlexView>
        );
    };

    // const Spreadsheet = () => {
    //     const Cell = text => <div style={{ ...textStyles.button, border: '1px solid #888', padding: 5 }}>{text}</div>;
    //     const Row = row => <FlexView>{row.map(Cell)}</FlexView>;
    //     return value.map(Row);
    // };

    const FileName = () => {
        const [hover, setHover] = useState(false);
        return (
            <label id={`${id}Label`} htmlFor={id}>
                <FlexView
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    column
                    hAlignContent="center"
                    vAlignContent="center"
                    style={{
                        ...styles.picker(hover),
                        ...textStyles.input,
                        height: isImage ? 140 : undefined,
                        borderRadius: isImage ? 0 : 5,
                        borderColor: isError ? colors.error : colors.formBorder,
                    }}
                >
                    {isImage ? (
                        <>
                            <Icon name={'image'} style={{ fontSize: 40 }} />
                            {'Add an image'}
                        </>
                    ) : (
                        ((files[0] || value) && (
                            <>
                                {files[0] ? files[0].name : label}
                                {value.includes('http') && (
                                    <a download={label} href={value}>
                                        {'Download'}
                                    </a>
                                )}
                            </>
                        )) ||
                        placeholder ||
                        `Select a file`
                    )}
                </FlexView>
            </label>
        );
    };

    const readAsDataURL = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
        });
    };

    const readAsBinaryString = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = () => {
                resolve(reader.result);
            };
        });
    };

    const readFile = async (file) => {
        const result = isImage ? await readAsDataURL(file) : await readAsBinaryString(file);
        if (isSpreadsheet) {
            const workBook = XLSX.read(result, { type: 'binary' });
            const workSheet = workBook.Sheets[workBook.SheetNames[0]];
            return XLSX.utils.sheet_to_json(workSheet, { header: 1 });
        }
        return result;
    };

    const fileChosen = async (event) => {
        let input = event.target;
        let fileArray = [];

        if (input.files.length) {
            for (let i = 0; i < input.files.length; i++) {
                fileArray.push(await readFile(input.files[i]));
            }

            multiple ? setValue([...value, ...fileArray]) : setValue(fileArray[0]);
            onChange && onChange(fileArray);
            setFiles(input.files);
            validateField(fileArray);
        }
    };

    return (
        <div style={{ ...containerStyles.formFieldContainer, ...containerStyle }}>
            <div style={containerStyles.formFieldLabel}>{label && label.toUpperCase()}</div>

            <input
                multiple={multiple}
                style={styles.input}
                type={'file'}
                accept={isImage ? 'image/*' : null}
                id={id}
                onChange={fileChosen}
            />
            {isImage ? <Images /> : <FileName />}

            {isError && <div style={containerStyles.formFieldErrorLabel}>{errorLabel}</div>}
        </div>
    );
};

const styles = {
    input: {
        ...textStyles.button,
        width: '0.1px',
        height: '0.1px',
        opacity: 0,
        overflow: 'hidden',
        // position: 'absolute', // caused extra scrollbar in Settings module
        zIndex: -1,
    },

    picker: (hover) => ({
        display: 'flex',
        cursor: 'pointer',
        border: '1px solid #ddd',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.input,
        height: 140,
        padding: 8,
        backgroundColor: hover ? '#efefef' : '#fff',
    }),

    deleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        cursor: 'pointer',
    },

    imageContainer: {
        minHeight: 120,
        minWidth: 120,
        position: 'relative',
        backgroundColor: '#fefefe',
    },

    mainImageContainer: {
        ...textStyles.input,
        paddingTop: 8,
        paddingBottom: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.input,
        border: '1px solid #ddd',
        borderRadius: 5,
    },
};
