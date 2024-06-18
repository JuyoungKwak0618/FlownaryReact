import React, { useContext, useEffect, useRef, useState } from "react";
import { Icon, Card, Button, Grid, Typography, Box, Input, TextareaAutosize } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AntSwitch } from '../postingStyle.jsx';
import { UploadImage } from "../../../api/image.js";
import { GetWithExpiry, UserContext } from "../../../api/LocalStorage.js";
import MDBox from "components/MDBox";
import { wrong } from "api/alert";
import { correct } from "api/alert";
import { insertBoard } from "api/axiosPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "api/axiosGet.js";

export default function Posting() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeUser } = useContext(UserContext);
  
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashTag, setHashTag] = useState('');
  const ariaLabel = { 'aria-label': 'description' };
  const [isDeleted, setIsDeleted] = useState(0);

  const handleFileChange = async (event) => {
    if (event.target.files.length === 0) return;
    if (event.target.files.length + images.length > 5) {
      wrong('최대 5개의 이미지만 업로드할 수 있습니다.');
      return;
    }
    const selectedFiles = Array.from(event.target.files);
    setImages(images.concat(selectedFiles));
    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previewUrls.concat(newPreviewUrls));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (activeUser.uid === -1) {
      wrong("로그인이 필요한 서비스입니다.")
      navigate("/authentication/sign-in")
      return;
    }

    const imageList = await Promise.all(
      images.map(async (image) => {
        const url = await UploadImage(image);
        return url.public_id;
      })
    );
    if (imageList.toString() === '') {
      wrong('1개 이상의 사진 파일이 필요합니다.');
      return;
    }
    if (title === '') {
      wrong('제목을 입력하세요');
      return;
    }
    if (content === '') {
      wrong('내용을 입력하세요.');
      return;
    }

    correct('성공적으로 작성되었습니다.');

    var sendData = JSON.stringify({
      uid: activeUser.uid,
      title: title,
      bContents: content,
      image: imageList.toString(),
      nickname: activeUser.nickname,
      hashTag: hashTag.toString(),
      isDeleted: isDeleted
    });

    await insertBoard(sendData);
    await queryClient.invalidateQueries(['boardList', activeUser.uid]);

    setImages([]);
    setPreviewUrls([]);
    setTitle('');
    setContent('');
    setHashTag('');
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const publicToggle = () => {
    setIsDeleted(isDeleted === 0 ? -1 : 0);
  };

  const handleHashTagChange = (e) => {
    // 입력된 값을 콤마(,)로 구분하여 배열로 만듭니다.
    const tags = e.target.value.split(",").map(tag => tag.trim());
    // 최대 5개까지의 해시태그만 저장합니다.
    setHashTag(tags.slice(0, 3));
  };

  return (
    <MDBox mt={-8} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
          <div >
            {/* 이미지 추가 버튼 */}
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
            <Button component="label" onClick={publicToggle}>
              <Typography sx={{ marginRight: '1em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>비공개</Typography>
              <AntSwitch sx={{ marginTop: '0.25em' }} defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
              <Typography sx={{ marginLeft: '1em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>공개</Typography>
            </Button>
            <Button type="submit" style={{ color: 'black' }} onClick={handleFormSubmit}>작성</Button>
          </div>
        </Grid>

        {previewUrls.map((url, index) => (
          <Grid item key={index} xs={4} sm={2} sx={{ width: '100%' }}>
            <Card style={{ position: 'relative' }}> {/* Card에 position 속성을 추가하여 내부 요소를 포함하는 컨테이너 역할을 합니다. */}
              <img src={url} alt={`Preview ${index}`} style={{ width: '15.5vh', height: '15vh', objectFit: 'cover' }} />
              <button style={{ border: 'none', fontSize: 'large', borderRadius: '100%', position: 'absolute', top: 0, left: 0, backgroundColor: 'lightcoral', margin: 0, padding: 0, justifyContent: 'center', color: 'black', width: 20, height: 20 }}
                onClick={() => handleRemoveImage(index)}><Icon>close</Icon></button>
            </Card>

          </Grid>
        ))}
      </Grid>

      {/* 제목 작성 부분 */}
      <Grid item xs={12} sm={6} p='2px'>
        <Input
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="TITLE"
          fontSize={15}
          language='kr'
        />
      </Grid>

      {/* 내용 작성 부분 */}
      <Grid item xs={12} sm={6} p='2px'>
        <TextareaAutosize
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="어떤 일이 있나요?"
          style={{
            width: "100%",
            minHeight: 100,
            maxHeight: 100,
            overflow: "auto", // overflowY 대신 overflow 사용
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: 8,
            resize: "none",
            fontFamily: "'Noto Sans KR', sans-serif" // 폰트 적용
          }}
          maxLength={5000}
        />

      </Grid>
      {/* 해시태그 작성 부분 */}
      <Grid item xs={12} sm={6} p='2px'>
        <Input
          value={hashTag}
          onChange={(e) => handleHashTagChange(e)}
          placeholder="쉼표HashTag / 최대 3개"
          fontSize={15}
          fullWidth
          language='kr'
        />
      </Grid>

    </MDBox >
  );
}