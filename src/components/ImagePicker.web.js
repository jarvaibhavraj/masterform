import React from 'react';
import FileInput from './FileInput.web';

export default ({ props, context }) => {
    return <FileInput props={{ ...props, type: 'image' }} context={context} />;
};
