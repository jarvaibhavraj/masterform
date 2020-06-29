import React, { useState, useEffect } from 'react';
import FlexView from 'react-flexview';
import MapView from 'google-map-react';

import MasterForm from '../index';
import { Icon } from './PlatformSpecificModules.web';
import { colors, textStyles, containerStyles } from '../styles';

import './PlaceInput.web.css';

let MAPS_API_KEY_WEB = '';

const getCurrentLocation = () => {
    // returns {latitude, longitude}
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position.coords);
            },
            (error) => {
                resolve(error);
            },
        );
    });
};

const getPlaceAtLocation = async (location) => {
    const { latitude, longitude } = location;
    const fetchResult = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${MAPS_API_KEY_WEB}`,
    );
    const resultJson = await fetchResult.json();

    return resultJson.results[0] || {};
};

const markerHeight = 24;
const markerWidth = 8;

const Marker = ({ height, width, color, style }) => {
    return (
        <FlexView
            column
            hAlignContent={'center'}
            style={{
                position: 'absolute',
                paddingBottom: (height || markerHeight) / 2,
                alignSelf: 'center',
                ...style,
            }}
        >
            <div
                style={{
                    height: width || markerWidth,
                    width: width || markerWidth,
                    backgroundColor: color || colors.formPrimary,
                }}
            />
            <div
                style={{
                    height: (height || markerHeight) - (width || markerWidth),
                    width: 2,
                    backgroundColor: color || colors.formPrimary,
                }}
            />
        </FlexView>
    );
};

const MapPlaceInput = ({ props, context }) => {
    const { name, label, onChange, validators, containerStyle = {}, style } = props;
    const { value, setValue, isError, setError, errorLabel, setErrorLabel, setFormState } = context;

    const isMobile = window && window.innerWidth < 800;

    const [initialPosition, setInitialPosition] = useState(value && value.latitude ? value : null);

    const setCurrentLocation = async (alsoSet) => {
        const position = await getCurrentLocation();
        setInitialPosition(position);
        const place = await getPlaceAtLocation(position);
        const toSetValue = {
            latitude: position.latitude,
            longitude: position.longitude,
            address: place.formatted_address,
            address_components: place.address_components,
            ...place,
        };
        if (alsoSet) {
            setValue(toSetValue);
            onChange && onChange(toSetValue);
        }
    };
    useEffect(() => {
        !(value && value.latitude) && setCurrentLocation().then(null);
    }, []);

    const updatePosition = async (data) => {
        if (data.center.lat === value && value.latitude && data.center.lng === value && value.longitude) {
            return;
        }

        const position = { latitude: data.center.lat, longitude: data.center.lng };
        // const place = await getPlaceAtLocation(position);
        const toSetValue = {
            latitude: position.latitude,
            longitude: position.longitude,
            // address: place.formatted_address,
            // address_components: place.address_components,
        };
        setValue(toSetValue);
        onChange && onChange(toSetValue);
    };

    const updateAddress = async () => {
        if (!value) return;

        const place = await getPlaceAtLocation(value);
        const toSetValue = {
            latitude: value && value.latitude,
            longitude: value && value.longitude,
            address: place.formatted_address,
            address_components: place.address_components,
            ...place,
        };
        setValue(toSetValue);
        onChange && onChange(toSetValue);
    };

    return (
        // Currently doesn't render properly without and extra div wrapper
        <div style={{ ...containerStyles.formFieldContainer, ...containerStyle }}>
            <FlexView
                column
                id={name}
                vAlignContent={'center'}
                style={{ position: 'relative', height: containerStyle.height || 200 }}
            >
                <div style={{ ...containerStyles.formFieldLabel }}>{label && label.toUpperCase()}</div>
                {initialPosition && (
                    <MapView
                        bootstrapURLKeys={{ key: MAPS_API_KEY_WEB }}
                        defaultZoom={16}
                        defaultCenter={{
                            lat: initialPosition.latitude,
                            lng: initialPosition.longitude,
                        }}
                        center={{
                            lat: (value && value.latitude) || initialPosition.latitude,
                            lng: (value && value.longitude) || initialPosition.longitude,
                        }}
                        options={{
                            clickableIcons: false,
                            fullscreenControl: true,
                            zoomControl: false,
                            gestureHandling: isMobile ? 'cooperative' : 'auto',
                        }}
                        onChange={updatePosition}
                    >
                        <Marker
                            lat={initialPosition.latitude}
                            lng={initialPosition.longitude}
                            style={{ top: -markerHeight + 2, left: -markerWidth / 2 }}
                            color={colors.accent}
                        />
                    </MapView>
                )}

                <Marker />

                <FlexView
                    column
                    hAlignContent={'right'}
                    vAlignContent={'bottom'}
                    style={{ position: 'absolute', bottom: 6, left: 6, right: 6 }}
                >
                    <FlexView>
                        <FlexView
                            hAlignContent={'center'}
                            vAlignContent={'center'}
                            style={{
                                cursor: 'pointer',
                                height: 32,
                                width: 32,
                                borderRadius: 2,
                                backgroundColor: colors.formBackground,
                                boxShadow: `1px 1px 1px #0003`,
                            }}
                            onClick={updateAddress}
                        >
                            <Icon name={'text-subject'} style={{ fontSize: 22 }} />
                        </FlexView>
                        <FlexView
                            hAlignContent={'center'}
                            vAlignContent={'center'}
                            style={{
                                cursor: 'pointer',
                                height: 32,
                                width: 32,
                                borderRadius: 2,
                                marginLeft: 8,
                                backgroundColor: colors.formBackground,
                                boxShadow: `1px 1px 1px #0003`,
                            }}
                            onClick={() => setCurrentLocation(true)}
                        >
                            <Icon name={'crosshairs-gps'} style={{ fontSize: 20 }} />
                        </FlexView>
                    </FlexView>
                    <div
                        style={{
                            ...textStyles.input,
                            fontSize: 10,
                            padding: 4,
                            marginTop: 8,
                            backgroundColor: colors.formBackground,
                            boxShadow: `1px 1px 1px #0003`,
                        }}
                    >
                        {value && value.address ? value.address : 'No address. Press location marker to update'}
                    </div>
                </FlexView>

                {!isError && <div style={containerStyles.formFieldErrorLabel}>{errorLabel}</div>}
            </FlexView>
        </div>
    );
};

const TextPlaceInput = ({ props, context, search }) => {
    /** In case of text mode the string of address get stored on the [name] of the field and location data is stored at [name]_data field */

    const {
        name,
        label,
        onChange,
        validators,
        onlyBusinesses,
        onlyAddresses,
        noIcon,
        noDefaultValue = false,
        center,
        multiple,
    } = props;
    const { value, setValue, isError, setError, errorLabel, setErrorLabel, setFormState, formState } = context;

    const placeInputId = `${name}PlaceInput`;
    const maps = window.google.maps;

    console.log('center', center);

    const initPlacesAutocomplete = async () => {
        const inputField = document.getElementById(placeInputId);
        const autocomplete = new maps.places.Autocomplete(inputField, {
            // location: `19.224483,72.967224`,
            types: [(onlyAddresses && 'geocode') || (onlyBusinesses && 'establishment')],
        });

        const searchBox = new maps.places.SearchBox(inputField, {
            // location: `19.224483,72.967224`,
            types: [(onlyAddresses && 'geocode') || (onlyBusinesses && 'establishment')],
        });

        // autocomplete.setFields([
        //     'address_component', // Basic fields
        //     'adr_address',
        //     'formatted_address',
        //     'geometry',
        //     'icon',
        //     'name',
        //     'permanently_closed',
        //     'photo',
        //     'place_id',
        //     'plus_code',
        //     'type',
        //     'url',
        //     'utc_offset',
        //     'vicinity',
        //     // 'formatted_phone_number', // Contact fields - extra charges
        //     // 'international_phone_number',
        //     // 'opening_hours',
        //     // 'website',
        //     // 'price_level', // Atmosphere fields - extra extra charges
        //     // 'rating',
        //     // 'review',
        //     // 'user_ratings_total',
        // ]);

        if (navigator.geolocation) {
            const position = await getCurrentLocation();

            var geolocation = {
                lat: position.latitude,
                lng: position.longitude,
            };
            var circle = new maps.Circle({ center: geolocation, radius: position.accuracy });
            autocomplete.setBounds(circle.getBounds());
        }

        // autocomplete.addListener('place_changed', () => {
        //     const place = autocomplete.getPlace();
        //     console.log('google autocomplete ^^', place, place.address_components);

        //     if (!place.address_components) {
        //         // The user pressed enter in the input
        //         // without selecting a result from the list
        //         // Let's get the list from the Google API so that
        //         // we can retrieve the details about the first result
        //         // and use it (just as if the user had actually selected it)
        //         console.log('Place enter ^^ automatic', place);
        //     } else {
        //         console.log('Place enter ^^ selected', place);
        //     }
        // });

        searchBox.addListener('places_changed', () => {
            var places = searchBox.getPlaces();
            console.log('Place enter ^^ searchBox', places);

            if (places[0]) {
                if (!multiple)
                    setFormState((prevState) => {
                        return {
                            ...prevState,
                            [name]: places[0].formatted_address || '',
                            [`${name}_data`]: {
                                lat: places[0].geometry && places[0].geometry.location.lat(),
                                lng: places[0].geometry && places[0].geometry.location.lng(),
                                adr: places[0].formatted_address,
                                ...places[0],
                            },
                        };
                    });
                else
                    setFormState((prevState) => {
                        return {
                            ...prevState,
                            [name]: '',
                            [`${name}_data`]: [
                                ...(prevState[`${name}_data`] || []),
                                {
                                    lat: places[0].geometry && places[0].geometry.location.lat(),
                                    lng: places[0].geometry && places[0].geometry.location.lng(),
                                    adr: places[0].formatted_address,
                                },
                            ],
                        };
                    });
            }
        });
    };

    useEffect(() => {
        maps && initPlacesAutocomplete();
    }, []);

    console.log('placeInput props', props);

    return (
        <>
            <MasterForm.TextInput
                id={placeInputId}
                placeholder={!maps ? 'Maps API not found' : 'Enter a Location'}
                {...props}
                // name={placeInputId}
                rightIconName={!noIcon && 'crosshairs-gps'}
                rightIconOnPress={async () => {
                    const currentLocation = await getCurrentLocation();
                    const place = await getPlaceAtLocation(currentLocation);
                    setFormState((prevState) => {
                        return {
                            ...prevState,
                            [`${name}`]: place.formatted_address,
                            [`${name}_data`]: {
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                                address: place.formatted_address,
                                address_components: place.address_components,
                                ...place,
                            },
                        };
                    });
                }}
            />
        </>
    );
};

export default ({
    props: {
        mode = 'map', // map, text
        apiKey = '',
        ...restProps
    },
    context,
}) => {
    MAPS_API_KEY_WEB = apiKey;

    return mode === 'text' ? (
        <TextPlaceInput props={restProps} context={context} />
    ) : (
        <MapPlaceInput props={restProps} context={context} />
    );
};
