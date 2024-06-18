import { useState, useEffect, useContext } from "react";

// react-router 컴포넌트들
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types는 props의 타입체크를 위한 라이브러리입니다.
import PropTypes from "prop-types";

// @material-ui core 컴포넌트
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React 컴포넌트
import MDBox from "components/MDBox";

// Material Dashboard 2 React 예제 컴포넌트
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// DashboardNavbar의 사용자 정의 스타일
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React 컨텍스트
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { Avatar, Box, Button, Card, CardContent, Grid, MenuItem, Modal, Popover, Stack, TextField, Typography } from "@mui/material";
import FilterVintageTwoToneIcon from '@mui/icons-material/FilterVintageTwoTone';

// api 컴포넌트
import { GetWithExpiry } from "api/LocalStorage";
import { getUser } from "api/axiosGet";
import { wrong } from "api/alert";
import MDTypography from "components/MDTypography";
import axios from "axios";
import { SetWithExpiry } from "api/LocalStorage";
import { useQuery } from "@tanstack/react-query";
import { useGetUser } from "api/customHook";
import MapComponent from "./mapComponent";
import UserAvatar from "api/userAvatar";
import { UserContext } from "api/LocalStorage";

// 헤더 부분
function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();
  const [profileMenu, setProfileMenu] = useState(null); // 프로필 메뉴 상태 추가
  const goSetting = () => navigate('/verify');
  const goMypage = () => navigate('/mypage');
  const goLogin = () => navigate('/authentication/sign-in');

  const weatherDescKo = {
    201: '가벼운 비를 동반한 천둥구름',
    200: '비를 동반한 천둥구름',
    202: '폭우를 동반한 천둥구름',
    210: '약한 천둥구름',
    211: '천둥구름',
    212: '강한 천둥구름',
    221: '불규칙적 천둥구름',
    230: '약한 연무를 동반한 천둥구름',
    231: '연무를 동반한 천둥구름',
    232: '강한 안개비를 동반한 천둥구름',
    300: '가벼운 안개비',
    301: '안개비',
    302: '강한 안개비',
    310: '가벼운 적은비',
    311: '적은비',
    312: '강한 적은비',
    313: '소나기와 안개비',
    314: '강한 소나기와 안개비',
    321: '소나기',
    500: '악한 비',
    501: '중간 비',
    502: '강한 비',
    503: '매우 강한 비',
    504: '극심한 비',
    511: '우박',
    520: '약한 소나기 비',
    521: '소나기 비',
    522: '강한 소나기 비',
    531: '불규칙적 소나기 비',
    600: '가벼운 눈',
    601: '눈',
    602: '강한 눈',
    611: '진눈깨비',
    612: '소나기 진눈깨비',
    615: '약한 비와 눈',
    616: '비와 눈',
    620: '약한 소나기 눈',
    621: '소나기 눈',
    622: '강한 소나기 눈',
    701: '박무',
    711: '연기',
    721: '연무',
    731: '모래 먼지',
    741: '안개',
    751: '모래',
    761: '먼지',
    762: '화산재',
    771: '돌풍',
    781: '토네이도',
    800: '구름 한 점 없는 맑은 하늘',
    801: '약간의 구름이 낀 하늘',
    802: '드문드문 구름이 낀 하늘',
    803: '구름이 거의 없는 하늘',
    804: '구름으로 뒤덮인 흐린 하늘',
    900: '토네이도',
    901: '태풍',
    902: '허리케인',
    903: '한랭',
    904: '고온',
    905: '바람부는',
    906: '우박',
    951: '바람이 거의 없는',
    952: '약한 바람',
    953: '부드러운 바람',
    954: '중간 세기 바람',
    955: '신선한 바람',
    956: '센 바람',
    957: '돌풍에 가까운 센 바람',
    958: '돌풍',
    959: '심각한 돌풍',
    960: '폭풍',
    961: '강한 폭풍',
    962: '허리케인'
  };

  // 유저 불러오기
  const { activeUser } = useContext(UserContext);
  const uid = activeUser.uid;
  const email = activeUser.email;
  const nickname = activeUser.nickname;
  const uname = activeUser.uname;
  const profile = activeUser.profile ? activeUser.profile : null;
  const role = activeUser.role;
  const [location, setLocation] = useState('');

  const user = useQuery({
    queryKey: ['user', uid],
    queryFn: () => getUser(uid),
  });

  useEffect(() => {
    if (user && user.data && user.data.location) {
      setLocation(user.data.location);
    }
  }, [user])

  const [weather, setWeather] = useState('');
  const [weatherDataFetched, setWeatherDataFetched] = useState(false);

  // API 가져오기
  const getWeatherByCoordinates = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lang=kr&lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      );
      // id 찾아서 매칭 후 description 한글 번역된 거 가져오기
      const weatherId = res.data.weather[0].id;
      const weatherKo = weatherDescKo[weatherId];
      // 날씨 아이콘 가져오기
      const weatherIcon = res.data.weather[0].icon;
      const weatherIconAdrs = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      // 소수점 버리기
      const temp = Math.round(res.data.main.temp);
      setWeather({
        description: weatherKo,
        temp: temp,
        links: weatherIconAdrs,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLocationChange = (lat, lon) => {
    // 처음 한 번만 실행되고, 그 후에는 실행되지 않도록 합니다.
    if (!weatherDataFetched) {
      getWeatherByCoordinates(lat, lon);
      setWeatherDataFetched(true); // 날씨 데이터를 가져왔음을 표시합니다.
    }
  };

  useEffect(() => {
    // 네비바 타입 설정
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // 네비바의 투명 상태 설정하는 함수
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    // 스크롤 시 handleTransparentNavbar 함수 호출 이벤트 리스너
    window.addEventListener("scroll", handleTransparentNavbar);

    // 초기 값으로 상태 설정
    handleTransparentNavbar();

    // 이벤트 리스너 정리
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);


  // 프로필 관련 함수
  const handleProfileMenuOpen = (event) => setProfileMenu(event.currentTarget); // 프로필 메뉴 열기 핸들러 추가
  const handleProfileMenuClose = () => setProfileMenu(null); // 프로필 메뉴 닫기 핸들러 추가

  // 프로필 버튼 클릭 후 상세 메뉴
  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={Boolean(profileMenu)}
      onClose={handleProfileMenuClose}
      sx={{ mt: 2 }}
    >
      {uid > 0 ? (
        <div>
          <MenuItem style={{ backgroundColor: "rgba(226, 223, 226, 0.625)", height: '4rem' }}
            onClick={goMypage}
          >
            <MDBox display="flex" alignItems="center" px={0.5} py={1} >
              {profile && (
                <Avatar alt="profile picture">
                  <div><UserAvatar profileUrl={profile} /></div>
                </Avatar>
              )}
              <MDBox ml={1.75}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{nickname}</div>
                <div style={{ marginLeft: '.125rem', fontSize: '12px' }}>{email}</div>
              </MDBox>
            </MDBox>
          </MenuItem>

          <MenuItem onClick={goMypage} style={{ width: '15rem', height: '3rem' }}>
            <Icon sx={{ marginRight: '.5rem' }}>account_circle</Icon>
            <p style={{ fontWeight: 'bold' }}>프로필</p>
          </MenuItem>

          <MenuItem onClick={goSetting} style={{ width: '15rem', height: '3rem' }} >
            <Icon sx={{ marginRight: '.5rem' }}>settings</Icon>
            <p style={{ fontWeight: 'bold' }}>설정</p>
          </MenuItem>
        </div>
      ) : (
        <MenuItem
          style={{
            width: '15rem', height: '3rem', display: 'flex', justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={handleProfileMenuClose}
        >
          <Typography variant="body2" onClick={goLogin} style={{ textAlign: 'center', cursor: 'pointer' }}>
            로그인을 해주세요.
          </Typography>
        </MenuItem>
      )}
    </Menu>
  );

  const [searchtext, setSearchtext] = useState('');

  const handleSearch = () => {
    if (searchtext === '' || searchtext === null) {
      wrong('검색어를 입력하십시오');
    }
    else {
      sessionStorage.setItem("search", searchtext);
      navigate('/search');
      setSearchtext('');
    }
  }

  const handleSearchText = (e) => {
    setSearchtext(e.target.value);
  }

  // 알림 메뉴 렌더링
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>send_outlined</Icon>} title="새로운 메시지가 있습니다" />
      <NotificationItem icon={<Icon>reply_all</Icon>} title="새로운 댓글이 있습니다" />
      <NotificationItem icon={<Icon>playlist_add_check</Icon>} title="오늘의 할 일이 있습니다" />
      <NotificationItem icon={<Icon>favorite</Icon>} title="User가 좋아요를 눌렀습니다" />
      <NotificationItem icon={<Icon>warning</Icon>} title="보안상의 문제가 있습니다" />
      <NotificationItem icon={<Icon>diversity_1</Icon>} title="새로운 패밀리를 찾아보세요" />
      <NotificationItem icon={<Icon>history_edu</Icon>} title="패밀리User의 새로운 게시물이 있습니다" />
    </Menu>
  );

  // 네비바 아이콘 스타일
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  function handleKeyPress(event) {
    if (event && event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <MapComponent location={location} onLocationChange={(lat, lon) => handleLocationChange(lat, lon)} />
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="yard" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {/* 헤더 박스 및 계정, 설정, 알림 아이콘 모양 */}
        {!role ? <>
          {isMini ? null : (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              {weather && activeUser.uid !== -1 ?
                <Stack direction="column" sx={{ flex: 0.5 }}>
                  <MDBox mt={1} mr={2} sx={{ position: 'sticky', top: "8%" }}>
                    <Box aria-owns={open ? 'mouse-over-popover' : undefined}
                      aria-haspopup="true"
                      onMouseEnter={handlePopoverOpen}
                      onMouseLeave={handlePopoverClose}>
                      <Grid container
                        sx={{ display: 'flex', justifyContent: 'center', mr: 5 }}>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                          <Typography sx={{ fontSize: 'small', fontWeight: 'bold' }}>{weather.temp}℃ </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Avatar sx={{ width: 50, height: 50 }} src={weather.links} alt="날씨 아이콘" />
                        </Grid>
                      </Grid>
                    </Box>
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <MDBox>
                        <Card sx={{ height: "70%" }}>
                          <MDBox pt={3} px={3}>
                            <MDTypography variant="h6" fontWeight="medium">
                              날씨 정보
                            </MDTypography>
                            <Avatar sx={{ width: 100, height: 100 }} src={weather.links} alt="날씨 아이콘" />
                            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
                              {location}:  {weather.temp}℃
                              <br />
                              {weather.description}
                            </CardContent>
                          </MDBox>
                        </Card>
                      </MDBox>
                    </Popover>
                  </MDBox>
                </Stack> : null}
              <MDBox color={light ? "white" : "inherit"} sx={{ display: { lg: 'flex', xs: 'none' } }}>
                <TextField
                  id="outlined-multiline-flexible"
                  variant="standard"
                  placeholder="검색어를 입력하세요!"
                  onChange={handleSearchText}
                  value={searchtext}
                  onKeyUp={handleKeyPress}
                />
                <IconButton
                  size="small"
                  color="inherit"
                  disableRipple
                  sx={{ cursor: 'pointer', mx: 2 }}
                  onClick={handleSearch} // 프로필 메뉴 열기 핸들러 연결
                >
                  <Icon sx={iconsStyle}>search</Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleProfileMenuOpen} // 프로필 메뉴 열기 핸들러 연결
                >
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  variant="contained"
                  onClick={handleOpenMenu}
                >
                  <Icon sx={iconsStyle}>notifications</Icon>
                </IconButton>
                {renderMenu()}
                {renderProfileMenu()}
              </MDBox>
            </MDBox>
          )}
        </> : null}
      </Toolbar>
    </AppBar >
  );
}

// DashboardNavbar의 props 기본값 설정
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// DashboardNavbar의 props 타입체크
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
