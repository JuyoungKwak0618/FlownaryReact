function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = ownerState;

  const { white, transparent, dark, grey, gradients } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem, rgba, linearGradient } = functions;

  return {
    background: active ? linearGradient('#FFFFFF80', '#f5d6e605') : transparent.main,
 // 사이드바 활성화 배경색
    color: active ? 'black' : 'inherit', // 기본 글자 색상
    display: "flex",
    alignItems: "center",
    width: "80%",
    padding: `${pxToRem(5)} ${pxToRem(10)}`,
    margin: `${pxToRem(5)} ${pxToRem(35)}`,
    borderRadius: borderRadius.xxl,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow: active ? md : "none", // 액티브 상태에서 그림자 추가
    [breakpoints.up("xl")]: {
      transition: transitions.create(["box-shadow", "background-color", "color"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },
    "&:hover, &:focus": {
      backgroundColor: !active ? (transparentSidenav && !darkMode ? grey[300] : rgba(whiteSidenav ? grey[400] : white.main, 0.2)) : undefined,
    },
    // 액티브 상태에서 아이콘 박스와 텍스트 스타일 변경
    "& .collapse-icon-box, & .collapse-text": active ? {
      color: '#EE81C0', // 아이콘 및 텍스트 색상 변경
      "& svg, svg g": {
        color: '#EE81C0', // SVG 아이콘 색상 변경
      }
    } : {},
  };
}

function collapseIconBox(theme, ownerState) {
  const { palette, transitions, borders, functions } = theme;
  const { transparentSidenav, whiteSidenav, darkMode, active } = ownerState;

  const { white, dark } = palette;
  const { borderRadius } = borders;
  const { pxToRem, rgba } = functions;

  return {
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    color: active ? '#f250ae' : '#2f154f',
    borderRadius: borderRadius.md,
    display: "grid",
    placeItems: "center",
    transition: transitions.create(["margin", "background-color", "color"], {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    "& svg, svg g": {
      color: transparentSidenav || whiteSidenav ? dark.main : white.main,
    },

    "&:hover": {
      backgroundColor: rgba(dark.main, 0.1), // 아이콘 박스 배경색 변경
      color: '#f250ae', // 아이콘 색상 변경
      "& svg, svg g": {
        color: '#f250ae', // SVG 아이콘 색상 변경
      },
    },
  };
}

const collapseIcon = {
  color: '#D8BFD8'
};

function collapseText(theme, ownerState) {
  const { transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(10),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
      transition: transitions.create(["opacity", "margin", "color"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
      color: active ? '#f250ae' : '#2f154f',
    },

    "& span": {
      fontWeight: 'bolder',
      fontSize: 'small',
      lineHeight: 0,
    },

    "&:hover": {
      color: '#f250ae', // 글자 색상 변경
      
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };
