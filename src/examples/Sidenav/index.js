import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// react-router-dom 컴포넌트
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// @mui material 컴포넌트
import { List, Divider, Link, Icon, Avatar, Box, Typography } from "@mui/material";

// MUI Icons
import PersonIcon from '@mui/icons-material/Person';

// Material Dashboard 2 React 컴포넌트
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";

// Material Dashboard 2 React 컨텍스트
import { useMaterialUIController, setMiniSidenav, setTransparentSidenav, setWhiteSidenav } from "context";

// api 컴포넌트
import { GetWithExpiry } from "api/LocalStorage";
import { getUser } from "api/axiosGet";
import { gl } from "chroma-js";
import UserAvatar from "api/userAvatar";
import { UserContext } from "api/LocalStorage";
import { getNoticeCount } from "api/axiosGet";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useWebSocket } from "api/webSocketContext";
import { noticeConfirm } from "api/alert";
import { insertFamilyUser } from "api/axiosPost";
import { deleteNotice } from "api/axiosPost";
import { getNoticeCountChat } from "api/axiosGet";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const confirmLocation = location.pathname.split('/')[1];
  const collapseName = location.pathname.replace("/", "");
  const [alertCount, setAlertCount] = useState(0);
  const [chatalertCount, setChatalertCount] = useState(0);
  const { activeUser } = useContext(UserContext);
  const { stompClient, isConnect } = useWebSocket();

  // 유저 불러오기
  const uid = parseInt(GetWithExpiry("uid"));
  const email = GetWithExpiry("email");
  const nickname = GetWithExpiry("nickname");
  const profile = GetWithExpiry("profile");

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  // navigate
  const navigate = useNavigate();
  const goMypage = () => navigate('/mypage')
  const goLogin = () => navigate('/authentication/sign-in')

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // Sidenav의 미니 상태를 설정하는 함수
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /* 창 크기 조정 시 handleMiniSidenav 함수를 호출하는 이벤트 리스너 */
    window.addEventListener("resize", handleMiniSidenav);

    // 초기 값으로 상태를 설정하기 위해 handleMiniSidenav 함수 호출
    handleMiniSidenav();

    // 정리 시 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  useEffect(() => {
    let noticeincrease;
    let noticereset;
    let noticeswal;
    let noticechatincrease;
    let noticechatreset;
    let noticecountupdate;
    let noticechatcountupdate;

    if (activeUser.uid !== -1) {
      const getCount = async () => {
        const count = await getNoticeCount(activeUser.uid);
        setAlertCount(count);
      }
      getCount();

      if (stompClient && isConnect) {
        noticeincrease = stompClient.subscribe(`/user/notice/` + activeUser.uid, (data) => {
          setAlertCount(prevCount => prevCount + 1);
        });
        noticereset = stompClient.subscribe(`/user/noticeAll/` + activeUser.uid, (data) => {
          setAlertCount(0);
        });
        noticechatincrease = stompClient.subscribe(`/user/chatnotice/` + activeUser.uid, (data) => {
          setChatalertCount(prevCount => prevCount + 1);
        });
        noticechatreset = stompClient.subscribe(`/user/chatnoticeAll/` + activeUser.uid, (data) => {
          setChatalertCount(0);
        });
        noticecountupdate = stompClient.subscribe(`/user/noticecount/` + activeUser.uid, (message) => {
          const data = JSON.parse(message.body);
          setAlertCount(data);
        });
          noticechatcountupdate = stompClient.subscribe(`/user/noticechatcount/` + activeUser.uid, (message) => {
          const data = JSON.parse(message.body);
          setChatalertCount(data);
        });

        noticeswal = stompClient.subscribe(`/user/swalnotice/` + activeUser.uid, async (message) => {
          const data = JSON.parse(message.body);

          const response = await noticeConfirm(data);

          if (response === 1) {
            deleteNotice(data.nid);
            switch (data.type) {
              case 5:
                insertFamilyUser(data.oid, activeUser.uid, 0, activeUser.nickname, '초기 메세지');
                navigate("/family");
                break;
              default:
                break;
            }
          }
          else if (response === 3) {
            setAlertCount(prevCount => prevCount + 1);
          }
        });
        console.log('Subscribed to notice');
      }
    }
    else if (activeUser.uid === -1) {
      setAlertCount(0);
      setChatalertCount(0);
    }

    return () => {
      console.log('Unsubscribed to notice');
      if (noticeincrease) {
        noticeincrease.unsubscribe();
      }
      if (noticereset) {
        noticereset.unsubscribe();
      }
      if (noticeswal) {
        noticeswal.unsubscribe();
      }
      if (noticechatincrease) {
        noticechatincrease.unsubscribe();
      }
      if (noticechatreset) {
        noticechatreset.unsubscribe();
      }
      if (noticecountupdate) {
        noticecountupdate.unsubscribe();
      }
      if (noticechatcountupdate) {
        noticechatcountupdate.unsubscribe();
      }
    };
  }, [activeUser.uid, stompClient, isConnect]);

  // routes.js에서 모든 경로를 렌더링 (Sidenav에 보이는 모든 항목)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
    let returnValue;
    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} noCollapse={noCollapse} alert1={alertCount} alert2={chatalertCount} />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} alert1={alertCount} alert2={chatalertCount} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        // 타이틀
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={1}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    } else if (type === "bottom") {
      (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    }

    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >

      <MDBox pt={0.1} pb={0} px={5} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        {/* title 크기 조정 */}
        <MDBox component={NavLink} to="/" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
          <MDBox component="img" src='/images/DarkLogo.png' alt="Brand" width="8rem" />
        </MDBox>

        {/* 로그인 상태에 따라 아바타 또는 로그인 요청 메시지 표시 */}
        {uid > 0 ? (
          <Box
            sx={{
              width: '11.5rem', height: '2rem', background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '15px', display: 'flex', alignItems: 'center'
            }}
          >
            <Avatar
              sx={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', overflow: 'hidden' }}
              onClick={goMypage}
            >
              {profile ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url('https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${profile}')`
                  }}
                />
              ) : (
                <PersonIcon sx={{ width: '85%', height: '90%' }} />
              )}
            </Avatar>
            <Box ml={1.95}>
              <Typography
                color={textColor}
                fontSize={'13.5px'}
                fontWeight={'bold'}
              >{nickname} 님
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '7rem', // 최소 너비 설정
              maxWidth: '20rem', // 최대 너비 설정 (필요 시)
              height: '2rem',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 1rem', // 좌우 패딩 설정
              boxSizing: 'border-box',
              whiteSpace: 'nowrap', // 텍스트가 줄바꿈되지 않도록 설정
            }}
          >
            <Typography
              color={textColor}
              fontSize={'13.5px'}
              fontWeight={'bold'}
              onClick={goLogin}
              sx={{
                cursor: 'pointer',
                transition: 'color 0.3s', // 색상 변화에 애니메이션 효과를 주기
                '&:hover': {
                  color: 'primary.dark' // 호버 시 색상을 변경 (MUI 테마 색상 사용)
                }
              }}
            >로그인을 해주세요
            </Typography>
          </Box>
        )}
      </MDBox>
      <Divider style={{ opacity: 1, border: 2 }} />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Sidenav의 props 기본값 설정
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Sidenav의 props 타입체크
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;