import React, { act, useContext, useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, List, Paper, ListItem, Avatar, Button, Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { UserContext } from 'api/LocalStorage';
import PropTypes from 'prop-types';
import { getFollowMeList } from 'api/axiosGet';
import { deleteFollow } from 'api/axiosPost';
import { Search } from '@mui/icons-material';
import { wrong } from "api/alert";
import { useRemoveFollow } from 'api/customHook';
import { Close } from '@mui/icons-material';
import UserAvatar from 'api/userAvatar';
import Loading from 'api/loading';

export default function FollowMeList(props) {

  const uid = props.uid;
  const { activeUser } = useContext(UserContext); 

  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const handleClose3 = props.handleClose3

  const followMeList = useQuery({
    queryKey: ['followmelist', uid],
    queryFn: () => getFollowMeList(uid),
  });

  const deleteFollowing = useRemoveFollow();
  const deleteFollowForm = (sendData) => {
    deleteFollowing(sendData);
  }

  const deleteFollowButton = (fid) => {
    wrong("플로우 취소되었습니다");
    deleteFollowForm(fid);
    queryClient.invalidateQueries('followmelist');
  }

  const handleMyPage = (uid) => {
    handleClose3();
    navigate("/mypage", { state: { uid: uid } });
  }

  if (followMeList.isLoading) {
      return (
        <div><Loading /></div>
      )
    }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography sx={{ color: 'lightcoral', my: 3, fontWeight: 'bold', fontSize: 'large' }}>
          플로워 리스트
        </Typography>
        <TextField
          fullWidth
          label="검색"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
        />
        {followMeList.data && followMeList.data.length > 0 ? (
          followMeList.data
            .filter(data => {
              //공백 허용, 대소문자 구분 X
              const searchWords = searchQuery.toLowerCase().split(' ');
              return searchWords.every(word => data.nickname.toLowerCase().includes(word));
            })
            .map((data, idx) => (
              <Paper
                key={idx}
                sx={{
                  mb: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '16px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #e0e0e0',
                }}
              >
                <Avatar onClick={() => handleMyPage(data.uid)}
                  sx={{ cursor: 'pointer', width: 56, height: 56, mr: 2 }}>
                  <UserAvatar profileUrl={data.profile} size={"medium"} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }} onClick={() => handleMyPage(data.uid)}>
                  <Typography variant="h6" component="div" >
                    {data.nickname}
                  </Typography>
                </Box>
                {data.uid === activeUser.uid && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Close />}
                    onClick={() => deleteFollowButton(data.fid)}
                  >
                    해제
                  </Button>
                )}
              </Paper>
            ))
        ) : (
          <Typography variant="body1">
            회원님을 플로우한 사용자가 없습니다.
          </Typography>
        )}
      </Box >
    </>
  );
}

FollowMeList.propTypes = {
  uid: PropTypes.number,
  handleClose3: PropTypes.func
};