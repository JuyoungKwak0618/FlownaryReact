// routes.js
import React from 'react';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React layouts
import Home from "layouts/home/HomeIndex.js";
import Album from "layouts/album/AlbumIndex.js";
import ChatList from "layouts/chatting/Chattinglist.js";
import ChatTemp from 'layouts/chatting/Chattingtemp.js';
import Mypage from "layouts/mypage/MypageIndex.js";
import Family from "layouts/family/FamilyIndex.js";
import Notifications from "layouts/notifications/NoticeIndex.js";
import Settings from "layouts/setting/SettingIndex.js";
import VerifySettings from 'layouts/setting/components/SettingCheckPwd';
import Team from "layouts/team/TeamIndex.js";
import Search from "layouts/Search/SearchIndex.js";
import SignIn from "layouts/authentication/sign-in/LoginIndex.js";
import SignUp from "layouts/authentication/sign-up/RegisterIndex.js";
import Logout from "layouts/authentication/logout";
import { FlashOnOutlined } from '@mui/icons-material';
import UpdateIndex from "layouts/home/Update/UpdateIndex.js"
import Statistics from 'layouts/admin/statistics/statisticsIndex';
import UserList from 'layouts/admin/userList/AdminUserList';
import BoardList from 'layouts/admin/boardList/AdminBoardList';
import Follow from 'layouts/follow/Follow';

const createRoutes = (isLoggedIn, isAdmin) => [
  {
    type: "collapse",
    name: "홈",
    key: "home",
    icon: <Icon fontSize="xx-large">roofing</Icon>,
    route: "/home",
    component: <Home />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "앨범",
    key: "album",
    icon: <Icon fontSize="xx-large">collections</Icon>,
    route: "/album",
    component: <Album />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "채팅",
    key: "chatlist",
    icon: <Icon fontSize="xx-large">send</Icon>,
    route: "/chatlist",
    component: <ChatList />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "임시채팅",
    key: "chattingtemp",
    icon: <Icon fontSize="xx-large">send</Icon>,
    route: "/chattingtemp",
    component: <ChatTemp />,
    visible: false,
  },
  {
    type: "collapse",
    name: "마이페이지",
    key: "mypage",
    icon: <Icon variant="outlined" fontSize="xx-large">contact_page</Icon>,
    route: "/mypage",
    component: <Mypage />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "패밀리",
    key: "family",
    icon: <Icon fontSize="xx-large">diversity_1</Icon>,
    route: "/family",
    component: <Family />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "플로우",
    key: "follow",
    icon: <Icon fontSize="xx-large">people</Icon>,
    route: "/follow",
    component: <Follow />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "알림",
    key: "notifications",
    icon: <Icon fontSize="xx-large">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "설정",
    key: "verify",
    icon: <Icon fontSize="xx-large">filter_vintage</Icon>,
    route: "/verify",
    component: <VerifySettings />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "collapse",
    name: "설정",
    key: "settings",
    route: "/settings",
    component: <Settings />,
  },
  {
    type: "collapse",
    name: "TEAM",
    key: "team",
    icon: <Icon fontSize="large">connect_without_contact</Icon>,
    route: "/team",
    component: <Team />,
    visible: !isAdmin ? true : false,
  },
  {
    type: "bottom",
    name: "검색",
    key: "search",
    route: "/search",
    component: <Search />,
    visible: false, // 로그인되지 않았을 때만 보임
  },
  {
    type: "collapse",
    name: "글쓰기수정",
    key: "write",
    icon: <Icon fontSize="xx-large">history_edu</Icon>,
    route: "/home/update",
    component: <UpdateIndex />,
    visible: false,
  },
  {
    type: "collapse",
    name: "이용 통계",
    key: "statistics",
    icon: <Icon fontSize="xx-large">donut_small</Icon>,
    route: "/statistics",
    component: <Statistics />,
    visible: isAdmin && isLoggedIn
  },
  {
    type: "collapse",
    name: "사용자 관리",
    key: "userList",
    icon: <Icon fontSize="xx-large">manage_accounts</Icon>,
    route: "/userList",
    component: <UserList />,
    visible: isAdmin && isLoggedIn
  },
  {
    type: "collapse",
    name: "게시물 관리",
    key: "boardList",
    icon: <Icon fontSize="xx-large">manage_search</Icon>,
    route: "/boardList",
    component: <BoardList />,
    visible: isAdmin && isLoggedIn
  },
  {
    type: "collapse",
    name: "로그인",
    key: "sign-in",
    icon: <Icon fontSize="xx-large">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    visible: !isLoggedIn, // 로그인되지 않았을 때만 보임
  },
  {
    type: "collapse",
    name: "로그아웃",
    key: "sign-out",
    icon: <Icon fontSize="xx-large">logout</Icon>,
    route: "/logout",
    component: <Logout />,
    visible: isLoggedIn, // 로그인되었을 때만 보임
  },
  {
    type: "collapse",
    name: "회원가입",
    key: "sign-up",
    icon: <Icon fontSize="xx-large">assignment</Icon>,
    component: <SignUp />,
    visible: false, // 로그인되지 않았을 때만 보임
  },

];

export default createRoutes;
