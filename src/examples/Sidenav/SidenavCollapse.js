// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import MailIcon from '@mui/icons-material/Mail';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { Badge } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UserContext } from "api/LocalStorage";
import { getNoticeCount } from "api/axiosGet";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useWebSocket } from "api/webSocketContext";
import { noticeConfirm } from "api/alert";
import { insertFamilyUser } from "api/axiosPost";
import { deleteNotice } from "api/axiosPost";
import { getNoticeCountChat } from "api/axiosGet";

function SidenavCollapse({ icon, name, active, alert1, alert2, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

  return (
    <ListItem component="li">
      <MDBox
        {...rest}
        sx={(theme) =>
          collapseItem(theme, {
            active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor,
          })
        }
      >
        <ListItemIcon
          sx={(theme) =>
            collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
          }
        >
          {typeof icon === "string" ? (
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
            name === '알림' || name === '채팅' ? (
              <Badge badgeContent={name === '알림' ? alert1 : alert2} color="primary">
                {icon}
              </Badge>
            ) : (
              icon
            )
          )}
        </ListItemIcon>

        <ListItemText
          primary={name}
          sx={(theme) =>
            collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active,
            })
          }
        />
      </MDBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  alert1: PropTypes.number,
  alert2: PropTypes.number,
  active: PropTypes.bool,
};

export default SidenavCollapse;
