// 기본
import React, { useState } from 'react';
import { Box, Modal, Grid, ListItem, List, Divider, ListItemAvatar, Avatar, ListItemText, ListSubheader } from '@mui/material';

// 아이콘
import MessageIcon from '@mui/icons-material/Message';
import ClearIcon from '@mui/icons-material/Clear';
import ForumIcon from '@mui/icons-material/Forum';

// Components/css 연결 
import '../notice.css';
import Chat from './Chat';

export default function ChattingModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      {/* Aside에 표시될 DM부분 표현 */}
      <button onClick={handleOpen} className='asideStyle'>
        <Grid container>
          <Grid item xs={12} lg={6} sx={{ display: { xs: 'flex', lg: 'flex' }, pl: 3 }}>
            <MessageIcon className='iconStyle' />
          </Grid>
          <Grid item xs={0} lg={6} sx={{ color:'rgb(58, 0, 85)', display: { xs: 'none', lg: 'flex' }, pr: 3, justifyContent: 'flex-end' }}>
            DM
          </Grid>
        </Grid>
      </button>

      {/* DM 부분 Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box className='styleBox2'>

          {/* 메시지 목록 리스트 */}
          <List sx={{ width: '20%', boxShadow: '0 0 6px rgba(0, 0, 0, 0.5)', padding: 3, justifyContent: 'center', alignItems: 'center', }}
            subheader={
              <>
                <Grid item sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'center', alignItems: 'center', }} >
                  <ListSubheader component="div" id="nested-list-subheader" sx={{ fontSize: 25, }}>
                    메시지
                  </ListSubheader>
                </Grid>
                <Grid item sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', alignItems: 'center',  }} >
                  <ListSubheader component="div" id="nested-list-subheader" sx={{ textAlign: 'center', fontSize: 25 }}>
                    <ForumIcon />
                  </ListSubheader>
                </Grid>
              </>
            }>
            <ListItem alignItems="flex-start" sx={{ marginBottom: '10%' }} >
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <Grid item sx={{ display: { xs: 'none', lg: 'flex' } }} >
                <ListItemText
                  primary='곽주영'
                  secondary='2024-04-25'
                />
              </Grid>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start" sx={{ marginBottom: '10%' }}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <Grid item sx={{ display: { xs: 'none', lg: 'flex' } }} >
                <ListItemText
                  primary='곽주영'
                  secondary='2024-04-25'
                />
              </Grid>
            </ListItem>
            <Divider variant="inset" component="li" />

            <ListItem alignItems="flex-start" sx={{ marginBottom: '10%' }}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <Grid item sx={{ display: { xs: 'none', lg: 'flex' } }} >
                <ListItemText
                  primary='곽주영'
                  secondary='2024-04-25'
                />
              </Grid>
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>

          {/* Chatting을 구현한 Components 추가*/}
          <Chat />

          {/* 닫기 버튼 */}
          <div className='board_div_style_2'>
            <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer', fontSize: '26px', backgroundColor: 'rgb(162, 152, 182)', borderRadius: '100%', margin: '3px' }} />
          </div>
        </Box>
      </Modal >
    </>
  );
}