import React, { useContext, useState } from 'react';
import { getFollowList } from 'api/axiosGet';
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, List, Paper, ListItem, Avatar, Button, Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { UserContext } from 'api/LocalStorage';
import PropTypes from 'prop-types';
import { deleteFollow } from 'api/axiosPost';
import { useRemoveFollow } from 'api/customHook';
import Iconify from 'components/iconify';
import { Search } from '@mui/icons-material';
import { wrong } from "api/alert";
import { Close } from '@mui/icons-material';
import UserAvatar from 'api/userAvatar';
import Loading from 'api/loading';

export default function FollowList(props) {

  const uid = props.uid;
  const { activeUser } = useContext(UserContext); 

  const [searchQuery, setSearchQuery] = useState('');

  const handleClose2 = props.handleClose2

  const navigate = useNavigate();

  const followList = useQuery({
    queryKey: ['followlist', uid],
    queryFn: () => getFollowList(uid),
  });

  const deleteFollowing = useRemoveFollow();
  const deleteFollowForm = (sendData) => {
    deleteFollowing(sendData);
  }

  const deleteFollowButton = (fid) => {
    wrong("플로우 취소되었습니다");
    deleteFollowForm(fid);
  }

  const handleMyPage = (uid) => {
    handleClose2();
    navigate("/mypage", { state: { uid: uid } });
  }


  if (followList.isLoading) {
    return (
      <div><Loading /></div>
    )
  }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography sx={{ color: 'lightcoral', my: 3, fontWeight: 'bold', fontSize: 'large' }}>
          플로잉 리스트
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
        {followList.data && followList.data.length > 0 ? (
          followList.data
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
                <Avatar onClick={() => handleMyPage(data.fuid)}
                  sx={{ cursor: 'pointer', width: 56, height: 56, mr: 2 }}>
                  <UserAvatar profileUrl={data.profile} size={"medium"} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }} onClick={() => handleMyPage(data.fuid)}>
                  <Typography variant="h6" component="div" >
                    {data.nickname}
                  </Typography>
                </Box>
                {(uid === activeUser.uid) && (
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
            플로우한 사용자가 없습니다.
          </Typography>
        )}
      </Box >
    </>
  );
}

FollowList.propTypes = {
  uid: PropTypes.number,
  handleClose2: PropTypes.func
};