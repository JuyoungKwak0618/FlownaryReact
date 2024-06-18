import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const Iconify = forwardRef(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

export default Iconify;

Iconify.propTypes = {
  icon: PropTypes.string.isRequired,
  width: PropTypes.number,
  sx: PropTypes.object,
};