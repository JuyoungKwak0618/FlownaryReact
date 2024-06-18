
// 사이드바 전체 틀
// @mui material components
import { ClassNames } from "@emotion/react";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import borders from "assets/theme/base/borders";


export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, whiteSidenav, miniSidenav, darkMode } = ownerState;

  const sidebarWidth = 265;  
  const backgroundImage = '/images/flowBlur.jpg' ; // 이미지 URL

  const { transparent, gradients, white, background } = palette;
  const { xxl } = boxShadows;
  const { pxToRem, linearGradient } = functions;

  let backgroundValue = darkMode
    ? background.sidenav
    : linearGradient(gradients.dark.main, gradients.dark.state);

  if (transparentSidenav) {
    backgroundValue = transparent.main;
  } else if (whiteSidenav) {
    backgroundValue = white.main;
  }

    
  // 사이드바 열림 스타일
  const drawerOpenStyles = () => ({    
    backgroundColor: 'rgba(250, 224, 250, 0.5)',         
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    borderRadius: "15px",        
    height:'100%',
    paddingTop:'0',
    marginTop:'-1.99px',
    marginLeft:'0',
    backgroundImage: `url(${backgroundImage})`, // 이미지 URL    
    backgroundSize: 'cover',
    backgroundPosition: 'center',        

    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "-0.95rem",
      width: sidebarWidth,         
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },    
  });

  
  // 미니 사이드바 스타일
  const drawerCloseStyles = () => ({
    background: backgroundValue,
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem(96),
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: xxl,
      border: "none",            
      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});
