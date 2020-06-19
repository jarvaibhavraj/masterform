import React, { useState, useEffect } from 'react';
import ImageViewer from 'react-images';

export { MaterialCommunityIcons as Icon } from 'react-web-vector-icons';

export const Lightbox = ({ images = [], initialIndex = 0, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
    useEffect(() => {
        setCurrentImageIndex(initialIndex);
    }, [initialIndex]);

    const theme = {
        container: {
            background: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10001,
        },
        arrow: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: '#222',
            opacity: 0.6,
            transition: 'opacity 200ms',
            ':hover': {
                opacity: 1,
            },
        },
        arrow__size__medium: {
            borderRadius: 40,
            height: 40,
            marginTop: -20,
            '@media (min-width: 768px)': {
                height: 70,
                padding: 15,
            },
        },
        arrow__direction__left: { marginLeft: 10 },
        arrow__direction__right: { marginRight: 10 },
        close: {
            fill: '#D40000',
            opacity: 0.6,
            transition: 'all 200ms',
            ':hover': {
                opacity: 1,
            },
        },
        footer: {
            color: 'black',
        },
        footerCount: {
            color: 'rgba(0, 0, 0, 0.6)',
        },
        thumbnail: {},
        thumbnail__active: {
            boxShadow: '0 0 0 2px #ff6846',
        },
    };

    return (
        <ImageViewer
            backdropClosesModal
            showThumbnails
            images={images.map(image => ({ src: image }))}
            currentImage={currentImageIndex >= 0 ? currentImageIndex : 0}
            onClickPrev={() => setCurrentImageIndex((currentImageIndex - 1) % images.length)}
            onClickNext={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
            onClickThumbnail={index => setCurrentImageIndex(index)}
            isOpen={isOpen}
            onClose={onClose}
            theme={theme}
        />
    );
};
