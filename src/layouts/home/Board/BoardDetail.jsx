import React, { forwardRef, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Box, Modal, IconButton, Typography, Avatar, Divider, CardHeader, Card, Grid, Button, Icon } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Reply from "./Reply";
import { getBoard } from "api/axiosGet";
import { useQuery } from "@tanstack/react-query";
import './board.css';
import TimeAgo from "timeago-react";
import { UserContext } from "api/LocalStorage";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import UserAvatar from "api/userAvatar";
import Loading from "api/loading";


const BoardDetail = forwardRef(({ bid, uid, index, handleClose, nickname, handleButtonLike, handleButtonLikeReply, handleButtonLikeReReply }, ref) => {

  timeago.register('ko', ko); // 한국어로 시간 표시 설정
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const { data: board, isLoading, isError } = useQuery({
    queryKey: ['board', bid, uid],
    queryFn: () => getBoard(bid, uid),
  });
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    handleClose();
  };

  const handleUpdate = () => {
    navigate("/home/Update")
    sessionStorage.setItem("bid", bid);
  }

  const { activeUser } = useContext(UserContext);
  const handleMyPage = (uid) => {
    navigate("/mypage", { state: { uid: uid } });
  }

  const image = board?.image ? board.image.split(',') : null;

  // 공유하기 URL 클립보드
  const handleShareButton = (bid) => {
    if (navigator.clipboard && board.shareUrl) {
      navigator.clipboard.writeText(`${process.env.REACT_APP_ADDRESS}/url/${board.shareUrl}`)
        .then(() => {
          setAlertOpen(true);
          setTimeout(() => setAlertOpen(false), 1500); // 1.5초 후에 알림을 닫습니다.
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  }
  if (isLoading) {
    return <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <Loading />
    </div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다.</div>;
  }

  return (
    <Box ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '80vh',
      }}>
      <Box
        sx={{
          flex: 1.2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
        <Carousel
          indicators={false}
          animation="slide"
          autoPlay={false}
          sx={{ maxWidth: '120%', maxHeight: '100%' }}
        >
          {image && image.map((image, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

              }}
              onClick={handleOpen} // 클릭 시 모달 열기
            >
              <div style={{
                width: '120%',
                height: '750px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden', // 이미지가 컨테이너를 벗어나지 않도록 함                
              }}>
                <img
                  style={{
                    objectFit: 'cover', // 이미지가 컨테이너에 맞게 조절됨
                    width: '120%',
                    height: '100%',
                    margin: '0',
                    padding: '0',
                  }}
                  src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${image}`}
                  alt={`Image ${index + 1}`}
                />
              </div>
            </Box>
          ))}
        </Carousel>
      </Box>

      <Box sx={{ flex: 0.8, display: 'flex', flexDirection: 'column', paddingLeft: 2, maxHeight: '100vh', overflowY: 'auto' }}>
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
            <CardHeader
              avatar={
                <Avatar onClick={() => handleMyPage(board.uid)}
                  sx={{ bgcolor: 'red'[500], cursor: 'pointer' }}
                  aria-label="recipe">
                  <UserAvatar profileUrl={board.profile} />
                </Avatar>
              }
              title={<Typography variant="subtitle3" sx={{ fontSize: "1rem", color: 'black', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleMyPage(board.uid)}>{board.nickname}</Typography>}
              subheader={<Typography sx={{ fontSize: "1rem", color: 'black', cursor: 'pointer', maxWidth: "100%" }}>{board.title}</Typography>}
            />
            {<TimeAgo datetime={board.modTime} locale='ko' style={{ fontSize: 'small', paddingBottom: 20 }} />}
            <IconButton sx={{ px: 0, pb: 2.5, my: 0, mx: 2, fontSize: '1.4rem' }} onClick={handleShareButton.bind(null, board.bid)}><Icon style={{ color: 'black' }}>ios_share</Icon></IconButton>
            <IconButton sx={{ mr: 3, width: 0, fontSize: '1.2rem', pt: 0, pb: 2.5, pr: 5 }} onClick={() => handleButtonLike(board.bid, board.uid)}>
              {board.liked ?
                <FavoriteIcon sx={{ color: 'lightcoral' }} /> : <FavoriteBorderIcon sx={{ color: 'lightcoral' }} />}
              {board.likeCount}
            </IconButton>
          </Grid>
        </Grid>
        <div>
          {alertOpen && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              URL이 클립보드에 복사되었습니다!
            </Alert>
          )}
        </div>
        <Typography color="text.secondary" sx={{ mt: 2, mr: 3, ml: 2, fontSize: 'small', maxHeight: '20vh', flex: 1, overflowY: 'auto', whiteSpace: 'pre-line' }}>
          {board.bContents}
        </Typography>
        <Box sx={{ flexGrow: 0, overflowY: 'auto', maxHeight: '47vh' }}> {/* 댓글 목록에 오버스크롤 적용 */}
          <Reply bid={bid} uid={uid} index={index} nickname={nickname} handleButtonLike={handleButtonLike} handleButtonLikeReReply={handleButtonLikeReReply} handleButtonLikeReply={handleButtonLikeReply} handleMyPage={handleMyPage} />
        </Box>
      </Box>

      {/* 모달 부분 */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px', // 모달 창의 너비 조정
              height: '500px', // 모달 창의 높이 조정
              bgcolor: 'background.paper',
              boxShadow: 24,
              overflow: 'hidden', // 내부 여백을 줄이기 위해 overflow를 hidden으로 설정
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              margin: 0,
            }}
          >
            <Carousel
              indicators={false}
              animation="slide"
              autoPlay={false}
              sx={{
                width: '100%',
                height: '100%',
              }}
            >
              {image && image.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden', // 이미지가 컨테이너를 벗어나지 않도록 함
                  }}
                >
                  <img
                    style={{
                      objectFit: 'contain', // 모달 창에서도 동일한 크기로 설정
                      margin: '0',
                      padding: '0',
                      width: '500px', // 부모 요소의 크기에 맞추어 설정
                      height: '500px',
                    }}
                    src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${image}`}
                    alt={`Image ${index + 1}`}
                  />
                </Box>
              ))}
            </Carousel>
          </Box>
        </>
      </Modal>
    </Box >
  );
});

BoardDetail.propTypes = {
  bid: PropTypes.number,
  uid: PropTypes.number,
  index: PropTypes.number,
  handleClose: PropTypes.func,
  nickname: PropTypes.string,
  handleButtonLike: PropTypes.func,
  handleButtonLikeReply: PropTypes.func,
  handleButtonLikeReReply: PropTypes.func,
};

export default BoardDetail;