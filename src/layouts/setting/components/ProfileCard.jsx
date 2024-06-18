import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardContent, Avatar, Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/system";
import './ProfileSetting.css';
import UserAvatar from "api/userAvatar";
import { SetWithExpiry } from "api/LocalStorage";
import PersonIcon from '@mui/icons-material/Person';

// 배경 스타일 설정
const Background = styled(Box)({
  background: "url('/images/flowLight.png')", // 배경 이미지 URL
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "150px",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
});

function ProfileCard(props) {
  const [preview, setPreview] = useState('');
  const [image, setImage] = useState('');

  const handleImageEdit = () => {
    document.getElementById('hidden-input').click();
  };

  const handlePicture = (e) => { setImage(e); } // 미리보기
  const handleProfileChange = (e) => { setProfile(e); };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    } else {
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
        props.onChangePicture(file); // 파일 객체 대신 데이터 URL을 전달
      };
    }
  };

  const handleImageDelete = () => {
    setPreview('');
    props.onChangePicture(''); // 파일 삭제 시 null 전달
    SetWithExpiry("profile", null);
  };

  return (
    <>
      <Avatar
        className="avatarPhoto"
        sx={{ width: 100, height: 100, margin: "0 auto", cursor: 'pointer' }}
        onClick={handleImageEdit}
      >
        {preview ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${preview})`
            }}
          ></div>
        ) : props.profile ? (
          <UserAvatar profileUrl={props.profile} size={"medium2"} />
        ) : (
          <PersonIcon sx={{ width: '100%', height: '100%' }} />
        )}
      </Avatar>
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        hidden
        id="hidden-input"
      />
      <span style={{
        fontSize: 'large',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>{props.nickname}</span><br />

      <span
        style={{
          fontSize: 'medium',
          fontWeight: 'lighter',
          textAlign: 'center',
        }}>{props.statusMessage}</span>
      <br /><br />
      <p></p>

      <Button
        variant='contained'
        onClick={handleImageEdit}
        style={{
          marginRight: '2.5em',
          backgroundColor: 'rgb(54, 11, 92)',
          color: 'white'
        }}>사진수정 </Button>
      <Button
        variant='contained'
        onClick={handleImageDelete}
        style={{
          marginLeft: '2.5em',
          backgroundColor: 'rgb(99, 11, 92)',
          color: 'white'
        }}>사진삭제</Button>
    </>
  );
}

ProfileCard.propTypes = {
  statusMessage: PropTypes.string.isRequired,
  profile: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  statusMessage: PropTypes.string.isRequired,
  onChangePicture: PropTypes.func.isRequired,
};

export default ProfileCard;