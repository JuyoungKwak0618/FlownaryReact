import { useContext, useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import {
  Avatar, Box, Button, Chip, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Modal, Paper, Stack, TextField, Typography, InputAdornment,
  IconButton, Link,
  CardContent,
  Icon,
  CardActions,
} from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import NotificationItem from "examples/Items/NotificationItem";
import { UserContext } from "api/LocalStorage";
import { deleteNoticeAll } from "api/axiosPost";
import { useWebSocket } from "api/webSocketContext";
import { getNoticeList } from "api/axiosGet";
import { isEmpty } from "api/emptyCheck";
import { useNavigate } from "react-router-dom";
import { deleteNotice } from "api/axiosPost";
import { getBoard } from "api/axiosGet";
import { insertFamilyUser } from "api/axiosPost";

export default function Notifications() {

  const { activeUser } = useContext(UserContext);
  const { stompClient } = useWebSocket();
  const [notice1, setNotice1] = useState([]);
  const [notice2, setNotice2] = useState([]);
  const [notice3, setNotice3] = useState([]);
  const [notice4, setNotice4] = useState([]);
  const [notice5, setNotice5] = useState([]);
  const [open, setOpen] = useState([false, false, false, false, true]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeUser.uid !== -1) {
      const getNotices = async () => {
        const list1 = await getNoticeList(activeUser.uid, 1);
        setNotice1(list1);
        const list2 = await getNoticeList(activeUser.uid, 2);
        setNotice2(list2);
        const list3 = await getNoticeList(activeUser.uid, 3);
        setNotice3(list3);
        const list4 = await getNoticeList(activeUser.uid, 4);
        setNotice4(list4);
        const list5 = await getNoticeList(activeUser.uid, 5);
        setNotice5(list5);
        deleteNoticeAll(activeUser.uid, 0);
      }

      getNotices();

      let nlist1;
      let nlist2;
      let nlist3;
      let nlist4;
      let nlist5;

      if (stompClient && stompClient.connected) {
        console.log('notice page connected');
        stompClient.publish({
          destination: '/app/page',
          body: JSON.stringify({ userId: activeUser.uid, page: 'notice', action: 'enter' }),
        });

        nlist1 = stompClient.subscribe(`/user/notice1/` + activeUser.uid, (message) => {
          const data = JSON.parse(message.body);
          setNotice1(prevData => [data, ...prevData]);
        });
        nlist2 = stompClient.subscribe(`/user/notice2/` + activeUser.uid, (message) => {
          const data = JSON.parse(message.body);
          setNotice2(prevData => [data, ...prevData]);
        });
        nlist3 = stompClient.subscribe(`/user/notice3/` + activeUser.uid, (message) => {
          const data = JSON.parse(message.body);
          setNotice3(prevData => [data, ...prevData]);
        });
        nlist4 = stompClient.subscribe(`/user/notice4/` + activeUser.uid, (message) => {
          const data = JSON.parse(message.body);
          setNotice4(prevData => [data, ...prevData]);
        });
        nlist5 = stompClient.subscribe(`/user/notice5/` + activeUser.uid, (message) => {
          const data = JSON.parse(message.body);
          setNotice5(prevData => [data, ...prevData]);
        });
      }

      return () => {
        if (stompClient && stompClient.connected) {
          stompClient.publish({
            destination: '/app/page',
            body: JSON.stringify({ userId: activeUser.uid, page: 'notice', action: 'leave' }),
          });
          console.log('notice page disconnected');
          if (nlist1) {
            nlist1.unsubscribe();
          }
          if (nlist2) {
            nlist2.unsubscribe();
          }
          if (nlist3) {
            nlist3.unsubscribe();
          }
          if (nlist4) {
            nlist4.unsubscribe();
          }
          if (nlist5) {
            nlist5.unsubscribe();
          }
        }
      }
    }
  }, []);

  const handleopen = (i) => {
    const newArray = [...open];
    newArray[i] = !open[i];
    setOpen(newArray);
  }

  const handleClick = async (nid, type, oid) => {
    deleteNotice(nid);
    if (type === 1) {
      const boards = await getBoard(oid);
      navigate(`/url/${boards.shareUrl}`, { state: { bid: oid } });
    }
    else if (type === 2) {
      const boards = await getBoard(oid);
      navigate(`/url/${boards.shareUrl}`, { state: { bid: oid } });
    }
    else if (type === 3) {
      navigate("/follow");
    }
    else if (type === 4) {
      navigate("/chatlist", { state: { cid: oid } });
    }
  }

  const handleClick2 = async (nid, oid, c, idx) => {
    await deleteNotice(nid);

    const newArray = notice5.filter((_, index) => index !== idx);
    setNotice5(newArray);
    if (c === 1) {
      await insertFamilyUser(oid, activeUser.uid, 0, activeUser.nickname, '초기 메세지');
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box m={3}>
        <Card sx={{ height: "100%", boxShadow: 'none', backgroundColor: 'beige' }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium" onClick={() => handleopen(0)}>
              새 글 알림 - {!isEmpty(notice1) ? notice1.length : 0}건
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }} >
              {open[0] && notice1 && !isEmpty(notice1) && notice1.map((item, idx) => (
                <NotificationItem key={idx} onClick={() => handleClick(item.nid, item.type, item.oid)} icon={<Icon>history_edu</Icon>} title={item.nContents} time={item.regTime} />
              ))}
            </CardContent>
          </Box>
        </Card>
      </Box>
      <Box m={3}>
        <Card sx={{ height: "100%", boxShadow: 'none', backgroundColor: 'beige' }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium" onClick={() => handleopen(1)}>
              댓글 알림 - {!isEmpty(notice2) ? notice2.length : 0}건
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
              {open[1] && notice2 && !isEmpty(notice2) && notice2.map((item, idx) => (
                <NotificationItem key={idx} onClick={() => handleClick(item.nid, item.type, item.oid)} icon={<Icon>reply_all</Icon>} title={item.nContents} time={item.regTime} />
              ))}
            </CardContent>
          </Box>
        </Card>
      </Box>
      <Box m={3}>
        <Card sx={{ height: "100%", boxShadow: 'none', backgroundColor: 'beige' }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium" onClick={() => handleopen(2)}>
              팔로우 알림 - {!isEmpty(notice3) ? notice3.length : 0}건
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
              {open[2] && notice3 && !isEmpty(notice3) && notice3.map((item, idx) => (
                <NotificationItem key={idx} onClick={() => handleClick(item.nid, item.type, item.oid)} icon={<Icon>people</Icon>} title={item.nContents} time={item.regTime} />
              ))}
            </CardContent>
          </Box>
        </Card>
      </Box>
      <Box m={3}>
        <Card sx={{ height: "100%", boxShadow: 'none', backgroundColor: 'beige' }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium" onClick={() => handleopen(3)}>
              메세지 알림 - {!isEmpty(notice4) ? notice4.length : 0}건
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
              {open[3] && notice4 && !isEmpty(notice4) && notice4.map((item, idx) => (
                <NotificationItem key={idx} onClick={() => handleClick(item.nid, item.type, item.oid)} icon={<Icon>send</Icon>} title={item.nContents} time={item.regTime} />
              ))}
            </CardContent>
          </Box>
        </Card>
      </Box>
      <Box m={3}>
        <Card sx={{ height: "100%", boxShadow: 'none', backgroundColor: 'beige' }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium" onClick={() => handleopen(3)}>
              패밀리 알림 - {!isEmpty(notice5) ? notice5.length : 0}건
            </MDTypography>
            <Box>
              {open[4] && notice5 && !isEmpty(notice5) && notice5.map((item, idx) => (
                <Card key={idx} sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
                      {item.nContents}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleClick2(item.nid, item.oid, 1, idx)}>수락</Button>
                    <Button size="small" onClick={() => handleClick2(item.nid, item.oid, 0, idx)}>거부</Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
