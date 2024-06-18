import { Box, Button, Grid, Icon, IconButton, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "api/LocalStorage";
import { GetWithExpiry } from "api/LocalStorage";
import { getUser } from "api/axiosGet";
import Loading from "api/loading";
import axios from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserLoginService from "ut/userLogin-Service";

export default function SettingModal() {
  
  const email = GetWithExpiry("email");
  const { activeUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [veriPwd, setVeriPwd] = useState('');

  const goLogin = () => navigate('/authentication/sign-in');

  if (activeUser.uid === undefined || activeUser.uid < 0) {
    return <UserLoginService goLogin={goLogin} />;
  }

  // 비밀번호 숨기기/보이기
  const [showPassword, setShowPassword] = useState(false);
  // 비밀번호 숨기기/보이기 토글
  const togglePasswordVisibility = () => { setShowPassword(!showPassword); };

  const handlePwd = (e) => { setVeriPwd(e.target.value); };

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', activeUser.uid],
    queryFn: () => getUser(activeUser.uid),
  });

  function handleKeyPress(event) {
    if (event && event.key === 'Enter') {
      event.preventDefault(); // 기본 동작 방지
      confirmPWd();
    }
  }
  if (isLoading) {
    return (
      <div><Loading /></div>
    )
  }
  const auth = getAuth();
  const handleClose = () => { navigate(-1); }
  const confirmPWd = async () => {

    // Firebase Authentication을 통해 사용자를 인증합니다.
    try {
      await signInWithEmailAndPassword(auth, email, veriPwd);
      Swal.fire({
        icon: 'success',
        title: "비밀번호가 일치합니다.",
        showClass: {
          popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                `
        },
        hideClass: {
          popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                `
        }
      });
      navigate('/settings');
    } catch (error) {
      // 비밀번호가 일치하지 않을 때
      Swal.fire({
        title: "비밀번호가 일치하지 않습니다.",
        text: "다시 입력해주세요",
        icon: "warning"
      });
    }
  }

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />        
        {user && user.provider === 0 &&
          <Box sx={{ mx: '19rem', mt: '12rem' }}>
            {/* 비밀번호 입력 */}
            <TextField
              fullWidth
              label='비밀번호 확인'
              required
              variant="standard"
              type={showPassword ? 'text' : 'password'}
              sx={{ width: '100%' }}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      {showPassword ? <Icon>visibility_off</Icon> : <Icon> visibility </Icon>}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={handlePwd}
            />

            {/* 하단 버튼 영역 */}
            <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item lg={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={confirmPWd}
                  style={{ margin: '1em', width: '30%', backgroundColor: 'rgb(54, 11, 92)', color: 'white', fontSize: 'small' }}
                >
                  확인
                </Button>

                <Button
                  variant="contained"
                  onClick={handleClose}
                  style={{ margin: '1em', width: '30%', backgroundColor: '#bbbbbb', color: 'white', fontSize: 'small' }}
                >
                  취소
                </Button>
              </Grid>
            </Grid>
          </Box>}
      </DashboardLayout>
    </>
  );

}
