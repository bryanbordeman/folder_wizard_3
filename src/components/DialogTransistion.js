import React from 'react';
import Zoom from '@mui/material/Zoom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} {...({ timeout: 500 })} />;
    });

export default Transition;
