import React, { useContext, useEffect, useState } from "react";
import { Input, Card, Stack, Button, Grid, Modal, Typography, Box, TextareaAutosize, TextField, Icon } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 아코디언
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

// 이모티콘
import InputEmoji from 'react-input-emoji'

// 아이콘
import CreateIcon from '@mui/icons-material/Create';

// css 연결
import '../posting.css';
import { AntSwitch } from '../postingStyle.jsx';
import { UploadImage } from "api/image.js";
// import { FindImage, UploadImage2 } from "../../api/image.js";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { updateBoard } from "api/axiosPost";
import { getBoard } from "api/axiosGet";
import { useQuery } from "@tanstack/react-query";

export default function Posting() {
  const bid = sessionStorage.getItem("bid");
  // 글 내용
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [image, setImage] = useState('');
  const [hashTag, setHashTag] = useState('');
  const [nickname, setNickname] = useState('');
  const [profile, setProfile] = useState('');
  const [modTime, setModTime] = useState('');

  const board = useQuery({
    queryKey: ['board', bid],
    queryFn: () => getBoard(bid),
  });

  const createCloudImageUrl = (image) => {
    return image.includes(',') ? image.split(',').map(image =>
      `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${image}`
    ) : image;
  };

  useEffect(() => {
    if (board.data) {
      if (!title) setTitle(board.data.title);
      if (!text) setText(board.data.bContents);
      if (!shareUrl) setShareUrl(board.data.shareUrl);
      if (!hashTag) setHashTag(board.data.hashTag);
      if (!image) setImage(board.data.image);
      if (!nickname) setNickname(board.data.nickname);
      if (!profile) setProfile(board.data.profile);
      if (!modTime) setProfile(board.data.modTime);


      if (board.data.image) {
        const cloudImage = createCloudImageUrl(board.data.image);
        setPreviewUrls([cloudImage]);
      }
    }
  }, [board.data, title, text, shareUrl, hashTag, nickname, profile]);
  // 창열고 닫기
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 아코디언
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // 이미지 파일 불러오기
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);


  // 파일이 선택되었을 때 호출되는 함수
  const handleFileChange = async (event) => {
    if (event.target.files.length === 0) {
      return;
    }

    // 이미지가 5개를 초과하지 않도록 확인
    if (event.target.files.length + images.length > 5) {
      alert('최대 5개의 이미지만 업로드할 수 있습니다.');
      return;
    }

    const selectedFiles = Array.from(event.target.files);
    setImages(images.concat(selectedFiles));

    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previewUrls.concat(newPreviewUrls)); // 미리보기 URL 배열에 추가
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const currentDateTime = new Date();
    const koreanDateTime = new Date(currentDateTime.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const formattedDateTime = koreanDateTime.toISOString();

    const imageList = await Promise.all(
      images.map(async (image) => {
        const url = await UploadImage(image);
        return url.public_id;
      })
    );

    var sendData = JSON.stringify({
      bid: bid,
      title: title,
      bContents: text,
      image: imageList.toString(),
      hashTag: null,
      modTime: formattedDateTime,
    })

    updateBoard(sendData);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index)); // 이미지 배열에서 삭제
    setPreviewUrls(previewUrls.filter((_, i) => i !== index)); // 미리보기 URL 배열에서 삭제
  };

  // 해시태그 변경 핸들러
  const handleHashTagChange = (e) => {
    setHashTag(e.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box mt={5} sx={{ p: 2, mb: 1, backgroundColor: 'beige', borderRadius: 5 }}>
        {/* 모달의 상단에 있는 헤더 부분 */}
        <Stack marginTop={-4} direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
        </Stack>

        {/* 이미지 업로드 및 미리보기 */}
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
            <div>
              <Button component="label">
                <Icon style={{ color: 'black' }}>add_photo_alternate</Icon>
                <input
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </div>
            <div>
              <Button component="label">
                <Typography sx={{ marginRight: '1em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>비공개</Typography>
                <AntSwitch sx={{ marginTop: '0.25em' }} defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                <Typography sx={{ marginLeft: '1em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>공개</Typography>
              </Button>
              <Button onClick={handleFormSubmit} style={{ color: 'black' }}>작성</Button>
            </div>
          </Grid>

          {/* 이미지 미리보기 */}
          {previewUrls.map((url, index) => (
            <Grid item key={index} xs={4} sem={2}>
              <Card>
                <img src={url} alt={`Preview ${index}`} style={{ width: '15.5vh', height: '15vh', objectFit: 'cover' }} />
                <Button className='msg_button' style={{ justifyContent: 'center', border: "3px solid #BA99D1" }} sx={{ color: 'dark', width: '50%' }}
                  onClick={() => handleRemoveImage(index)}>제거</Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 제목 작성 부분 */}
        <Grid item xs={12} sm={6}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 입력..."
            style={{
              padding: '12px 15px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '93%',
              marginLeft: '15px',
              marginBottom: '10px',
              boxSizing: 'border-box',
              backgroundColor: 'none',
            }}
          />
        </Grid>

        {/* 내용 작성 부분 */}
        <Grid item xs={12} sm={6} p='2px'>
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="당신의 일상을 공유하세요!"
            style={{
              width: "70%",
              border: "1px solid #ddd", // 테두리 스타일 지정
              borderRadius: 4, // 테두리 모서리를 둥글게 만듭니다.
              padding: 8, // 내부 여백 추가
              resize: "none", // 사용자가 크기를 조정하지 못하도록 설정
              // overflowY: "auto" // overflow 속성을 삭제하고 overflowY만 사용
            }}
            maxLength={5000} // 최대 글자 수 지정
          />
        </Grid>
        {/* 해시태그 작성 부분 */}
        <Grid item xs={12} sm={6} p='2px'>
          <Input
            value={hashTag}
            onChange={(e) => handleHashTagChange(e)}
            placeholder="쉼표HashTag   /   최대 3개"
            fontSize={15}
            fullWidth
            language='kr'
          />
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

