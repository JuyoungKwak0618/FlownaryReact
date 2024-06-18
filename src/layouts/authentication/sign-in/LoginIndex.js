// 기본
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Typography } from "@mui/material";
import { SetWithExpiry, UserContext } from "../../../api/LocalStorage";

// firebase 연결
import { login } from "../../../api/firebase";
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// css/componets 연결
import '../theme.css'; // CSS 임포트

// alert 창
import Swal from "sweetalert2";
import axios from "axios";

// react-modal 추가
import Modal from 'react-modal';

// RegisterIndex 컴포넌트 추가
import Register from "../sign-up/RegisterIndex";
import { userRegister } from "api/axiosPost";
import { wrong } from "api/alert";

// 모달 element
Modal.setAppElement('#app');

export default function Login() {
  const [theme, setTheme] = useState('light'); // 초기 테마를 'light'로 설정

  // 애니메이션 상태
  const [animationClass, setAnimationClass] = useState('fade-enter');

  // 이미지 함수
  const backgroundImage = '/images/flowLight.png';
  const logoImage = '/images/LightLogo.png';
  const HelloLogo = '/images/HelloLight.png';
  const logoImage_Modal = '/images/DarkLogo.png'

  const auth = getAuth();

  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleChange = e => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }
  const { updateActiveUser } = useContext(UserContext);

  function handleKeyPress(event) {
    if (event && event.key === 'Enter') {
      event.preventDefault(); // 기본 동작 방지
      handleSubmit();
    }
  }

  const handleSubmit = async () => {
    try {
      if (!userInfo.email) {
        Swal.fire({
          icon: "warning",
          text: "이메일을 입력해주세요.",
        });
        return;
      }

      if (!userInfo.password) {
        Swal.fire({
          icon: "warning",
          text: "비밀번호를 입력해주세요.",
        });
        return;
      }

      const checkuser = await signInWithEmailAndPassword(auth, userInfo.email, userInfo.password);

      if (checkuser) {
        const user = auth.currentUser;
        if (user) {
          const res = await axios.get('/user/getUserByEmail', { params: { email: userInfo.email } })
            .catch(error => console.log(error));
          if (res.data.status === 1) {
            wrong('비활성화 된 계정입니다.')
            return;
          }
          const { id, email, nickname, role, uname, profile, statusMessage } = res.data;
          SetWithExpiry("uid", id, 180);
          SetWithExpiry("email", email, 180);
          SetWithExpiry("nickname", nickname, 180);
          SetWithExpiry("role", role, 180);
          SetWithExpiry("uname", uname, 180);
          SetWithExpiry("profile", profile, 180);
          SetWithExpiry("statusMessage", statusMessage, 180);
          updateActiveUser({ uid: id, email, nickname, uname, profile, statusMessage, role });

          if (res.data.role === 0) {
            navigate('/home');
            setTimeout(() => navigate('/home'), 500);
          } else {
            navigate('/statistics');
            setTimeout(() => navigate('/statistics'), 500);
          }
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "앗! 잠시만요",
        text: "이메일 혹은 비밀번호가 맞지 않아요.",
        footer: '<a href="/authentication/sing-up">혹시 계정이 없으신가요?</a>'
      });
      console.error(error);
    }
  }

  // 모달 상태
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    setModalIsOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className={`background ${theme} ${animationClass}`} style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Card id='cardMain' className="cardMain">
        <div id='login-box' className="loginBox">
          <div className={`welcome-message`}>
            <img src={HelloLogo} alt='Hello' style={{ maxWidth: '10%' }} />
          </div>
          <img src={logoImage} alt='LOGO' style={{ maxWidth: '20%' }} />

          <br />
          <input type="email" name='email' placeholder="닉네임 혹은 이메일" className="commonInputStyle"
            onChange={handleChange} onKeyUp={handleKeyPress} />
          <br />
          <input type="password" name='password' placeholder="비밀번호" className="commonInputStyle"
            onChange={handleChange} onKeyUp={handleKeyPress} style={{ marginBottom: '1rem' }} />
          <br />
          <button className="fill" onClick={handleSubmit}><img style={{ paddingRight: '10px', margin: '-5px', width: '1.5em' }} src="/images/favicon.png" alt="f" />로그인</button>
          <br /><br />
          <Typography style={{ fontSize: 'small', marginBottom: '1rem', color: theme === 'light' ? '#dca3e7' : '#ffffff' }}>혹시 계정이 없으신가요?</Typography>
          <div>
            <Link to="#" onClick={openModal} className={`custom-button ${theme}`}>가입하기</Link>
          </div>
          <br />
        </div>
      </Card>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Register Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <div className={`welcome-message-Modal`}>
            <img src={logoImage_Modal} alt='LOGO'
              style={{
                width: '10rem',
                height: '3em',
                marginBottom: '-1rem'
              }} />

          </div>
          <Typography sx={{ mb: 2, mt: 1, fontSize: 'large' }}>환영합니다!</Typography>
          <Typography style={{ fontSize: 'small' }}>아래 가입양식에 따라 회원가입을 진행해주세요</Typography>
          <Register closeModal={closeModal} /> {/* closeModal 전달 */}
        </div>
      </Modal>
    </div>
  );
}
