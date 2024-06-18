import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/system";
import { Box, Button, Card, CardContent, TextField, Typography, InputLabel, Grid, MenuItem, FormControl, Select, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

// css 연결
import './setting.css';
import axios from "axios";

// alert 창
import Swal from "sweetalert2";

// components 연결
import SettingBirth from "./SettingBirth.jsx";
import SettingTel from "./SettingTel.jsx";
import SettingNickname from "./SettingNickname.jsx";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { GetWithExpiry, SetWithExpiry } from "../../../api/LocalStorage.js";
import { UploadImage } from "../../../api/image.js";
import { useGetUser } from "../../../api/customHook.jsx";
import { correct, wrong } from "../../../api/alert.jsx";
import { userUpdate } from '../../../api/axiosPost';

// 생일 표현 
import dayjs from 'dayjs';
import ProfileCard from "./ProfileCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "api/loading";

const Header = styled(Box)({
  background: '#BA99D1',
  borderRadius: '8px 8px 0 0', // 상단만 라운드 처리
  color: 'white',
  textAlign: 'center',
  marginBottom: '1rem',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // 그림자 효과 추가
});

const Background = styled(Box)({
  background: "url('/images/flowLight.png')", // 배경 이미지 URL
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "150px",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
});

function ProfileEdit({ uid, email }) {
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', uid],
    queryFn: () => useGetUser(uid),
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F5') {
        event.preventDefault();
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  const [uname, setUname] = useState('');
  const [nickname, setNickname] = useState('');
  const [statusMessage, setStat] = useState('');
  const [snsDomain, setSnsDomain] = useState('');
  const [birth, setBirth] = useState('');
  const [tel, setTel] = useState('');
  const [gender, setGender] = useState(2);
  const [profile, setProfile] = useState('');
  const [location, setLocation] = useState('');
  // 활성화, 비활성화
  // const [status, setStatus] = useState('0');

  useEffect(() => {
    if (user && (!uname || !nickname)) {
      setUname(user.uname);
      setNickname(user.nickname);
      setStat(user.statusMessage);
      setSnsDomain(user.snsDomain);
      setTel(user.tel);
      setBirth(user.birth);
      setGender(user.gender);
      setProfile(user.profile);
      setLocation(user.location);
    }
  }, [user]);

  // 이미지 업로드
  const [preview, setPreview] = useState('');
  const [image, setImage] = useState('');

  // 설정 변경 조건 확인
  const [checkingBirth, setCheckingBirth] = useState(1);
  const [checkingNickname, setCheckingNickname] = useState(1);
  const [checkingTel, setCheckingTel] = useState(1);

  // 로그인 여부 확인
  useEffect(() => { if (uid == null) { navigate('/login'); } }, [uid, navigate]);

  // 설정창에서 값이 바뀔 때마다 저장하는 함수
  const handleUname = (e) => { setUname(e.target.value); };
  const handleNickname = (e) => { setNickname(e.target.value); };
  const handleStat = (e) => { setStat(e.target.value); };
  const handleGender = (e) => { setGender(e.target.value); };
  const handleSnsDomain = (e) => { setSnsDomain(e.target.value); };
  const handleTel = (e) => { setTel(e) };
  const handleBirthChange = (e) => { const formattedDate = dayjs(e).format('YYYY-MM-DD'); setBirth(formattedDate); }
  const handlePicture = (e) => { setImage(e); setProfile(e); };
  const handleLocation = (e) => { setLocation(e.target.value) };

  const handleCheckingBirth = (e) => { setCheckingBirth(e) };
  const handleCheckingTel = (e) => { setCheckingTel(e) };
  const handleCheckingNickname = (e) => { setCheckingNickname(e) };

  // 제출
  const handleSubmit = async () => {
    if (checkingBirth === 0) { wrong("생년월일 확인을 해주세요."); return; }
    if (uname === '') { wrong("이름을 입력하세요"); return; }
    if (checkingNickname === 0) { wrong("닉네임 중복 확인을 해주세요"); return; }
    if (checkingTel === 0) { wrong("전화번호 중복 확인을 해주세요"); return; }

    const url = await UploadImage(image); // 이 줄이 비동기 작업을 기다리고 URL을 반환합니다.
    SetWithExpiry("nickname", nickname, 180); // 세션에 바로 추가
    if (!url) { // 이미지 변경 X
      await axios.post('/user/update', {
        uid: uid,
        uname: uname,
        nickname: nickname,
        profile: profile,
        statusMessage: statusMessage,
        birth: birth,
        snsDomain: snsDomain,
        gender: gender,
        tel: tel,
        location: location
      }).catch(error => console.log(error));

    } else { // 이미지 변경 O 
      SetWithExpiry("profile", url.public_id, 180); // 세션에 바로 추가
      await axios.post('/user/update', {
        uid: uid,
        uname: uname,
        nickname: nickname,
        profile: url.public_id,
        statusMessage: statusMessage,
        birth: birth,
        snsDomain: snsDomain,
        gender: gender,
        tel: tel,
        location: location
      }).catch(error => console.log(error));
    }
    correct("설정 변경에 성공했습니다.");
  }

  const goBack = () => { navigate('/'); }
  if (isLoading) {
    return (
      <div><Loading /></div>
    )
  }
  return (
    <>
      {(user) ? <>
        <Card sx={{ width: '100%', borderRadius: "16px", boxShadow: 3, margin: 'auto' }}>
          <Background />
          <CardContent sx={{ textAlign: "center", mt: -8 }}>
            <ProfileCard profile={profile} nickname={nickname} statusMessage={statusMessage} image={image} onChangePicture={handlePicture} /><br />
          </CardContent>
        </Card>
        <Card sx={{ mt: 3 }}>
          <Header style={{ height: '2.05rem' }}>
            <Typography variant="subtitle1" sx={{ opacity: 0.825 }}>상세 정보</Typography>
          </Header>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <MDBox id="gender_select" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Select
                    id="gender_select"
                    value={gender}
                    onChange={handleGender}
                    sx={{
                      width: '100%', height: '70%',
                      textAlign: 'center', border: '0'
                    }}
                  >
                    <MenuItem value={0}>남자</MenuItem>
                    <MenuItem value={1}>여자</MenuItem>
                    <MenuItem value={2}>성별 설정 안함</MenuItem>
                  </Select>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SettingBirth birth={birth} checkingBirth={checkingBirth}
                  onBirthChange={handleBirthChange} changeCheckingBirth={handleCheckingBirth} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth placeholder="이메일" variant="standard" value={email} disabled sx={{ mt: 2, width: '100%' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='이름' required variant="standard"
                  value={uname} onChange={handleUname} sx={{ mt: 2, width: '100%' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="상태메시지" required variant="standard" value={statusMessage}
                  onChange={handleStat} sx={{ mt: 2, width: '100%' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="도메인 주소" required variant="standard"
                  value={snsDomain} onChange={handleSnsDomain} sx={{ mt: 2, width: '100%', }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SettingNickname nickname={nickname} email={email} checkingNickname={checkingNickname}
                  onNicknameChange={handleNickname} changeCheckingNickname={handleCheckingNickname} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SettingTel tel={tel} email={email} checkingTel={checkingTel}
                  onTelChange={handleTel} changeCheckingTel={handleCheckingTel} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="주소" required variant="standard"
                  value={location} onChange={handleLocation} sx={{ mt: 2, width: '100%', }} />
              </Grid>
              <Grid item xs={15}>

              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={handleSubmit} style={{ color: 'white' }}
                sx={{ m: '1em', width: '20%', p: 0, backgroundColor: 'rgb(54, 11, 92)', '&:hover, &:visited': { backgroundColor: 'rgb(54, 30, 150)' } }}>
                완료
              </Button>

              <Button variant="contained" onClick={goBack}
                style={{ color: 'white' }}
                sx={{ m: '1em', width: '20%', p: 0, backgroundColor: 'coral', '&:hover': { backgroundColor: 'rgb(20, 20, 20)' } }}>
                홈으로
              </Button>
            </Box>
          </CardContent>
        </Card>
      </> :
        <></>}
    </>
  );
}

ProfileEdit.propTypes = {
  uid: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
};

export default ProfileEdit;
