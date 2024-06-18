import { forwardRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// custom styles for the NotificationItem
import menuItem from "examples/Items/NotificationItem/styles";
import { Grid } from "@mui/material";

const NotificationItem = forwardRef(({ icon, title, time, ...rest }, ref) => (
  <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
    <Grid container component={Link} py={0.5} sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }} lineHeight={1}>
      <Grid item sx={{ display: "flex" }}>
        <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
          {icon && icon}
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" sx={{ ml: 1 }}>
          {title && title}
        </MDTypography>
      </Grid>
      <Grid item>
        <MDTypography variant="button" fontWeight="regular" sx={{ ml: 1 }}>
          {time && time.toString().split("T")[0]}  {time && time.toString().split("T")[1]}
        </MDTypography>
      </Grid>
    </Grid>
  </MenuItem >
));

// Typechecking props for the NotificationItem
NotificationItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.any
};

export default NotificationItem;
