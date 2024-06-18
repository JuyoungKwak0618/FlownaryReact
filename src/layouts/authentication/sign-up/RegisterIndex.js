import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { SetWithExpiry } from "../../../api/LocalStorage";
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import '../theme.css';
import Swal from "sweetalert2";
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import SettingBirth from "layouts/setting/components/SettingBirth";
import SettingNickname from "layouts/setting/components/SettingNickname";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, Divider, Grid, Icon, TextField, Typography, styled } from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { wrong, correct } from "api/alert";
import { userRegister } from "api/axiosPost";
import SmsLogin from './SmsLogin';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SEMDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Firebase 앱 초기화 (이미 초기화된 경우 재사용)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip placement='left' {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        marginRight: 5,
        boxShadow: theme.shadows[1],
        fontSize: 16,
    },
}));

export default function Register({ closeModal }) {
    const email = 'nobody@gmail.com';
    const [theme, setTheme] = useState('light');
    const [userInfo, setUserInfo] = useState({ email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    // 가입 조건
    const [gender, setGender] = useState(2);
    const [birth, setBirth] = useState('');
    const [uname, setUname] = useState('');
    const [nickname, setNickname] = useState('');

    const [checkingBirth, setCheckingBirth] = useState(0);
    const [checkingNickname, setCheckingNickname] = useState(0);
    const [checkingTel, setCheckingTel] = useState(0);

    const [verify, setVerify] = useState(0);

    const handleCheckingTel = (e) => { setCheckingTel(e) };

    // 생년월일  
    const handleBirth = (e) => {
        const formattedBirth = dayjs(e).format('YYYY-MM-DD');
        setBirth(formattedBirth);
        setCheckingBirth(0);
    };
    // 생년월일 유효성 검사
    const checkBirth = () => {
        // 현재 날짜를 가져오기
        const now = new Date();
        const currentYear = now.getFullYear(); // 현재 연도 가져오기
        const currentMonth = now.getMonth() + 1; // 현재 월 가져오기
        const currentDay = now.getDate(); // 현재 일 가져오기

        if (!birth) {
            wrong("생일을 입력하세요");
            return;
        }

        // birth가 문자열인지 확인
        const birthStr = typeof birth === 'string' ? birth : birth.toString();

        // 사용자가 입력한 생년월일을 연도, 월, 일로 나누기
        const userYear = parseInt(birthStr.slice(0, 4));
        const userMonth = parseInt(birthStr.slice(5, 7));
        const userDay = parseInt(birthStr.slice(8, 10));

        // 현재 날짜와 사용자가 입력한 생년월일의 차이 계산
        let yearDiff = currentYear - userYear;

        // 만약 현재 날짜의 월과 사용자의 생년월일의 월을 비교하여 현재 날짜가 사용자의 생년월일보다 작은 경우, 1년을 감소
        if (currentMonth < userMonth || (currentMonth === userMonth && currentDay < userDay)) {
            yearDiff--;
        }
        if (userYear > currentYear) {
            wrong("현재 날짜 이상은 입력 불가능합니다.");
            setCheckingBirth(0);
            return;
        } else if (yearDiff < 7) {
            wrong("7세 이하는 등록 불가능합니다.");
            setCheckingBirth(0);
            return;
        } else if (userYear <= 1900) {
            wrong("1900년 이상만 가능합니다.");
            setCheckingBirth(0);
            return;
        } else {
            correct("적정 연령입니다.");
            setCheckingBirth(1);
            return;
        }
    }

    // 닉네임
    const handleNickname = (e) => { setNickname(e.target.value); setCheckingNickname(0); };

    const checkNickname = () => {
        axios.get('/user/nickname',
            {
                params: {
                    email: email
                }
            })
            .then(response => {
                const userList = response.data; // 응답 데이터 전체를 가져옵니다.
                if (!userList) {
                    console.error('User list is undefined or null');
                    return;
                }
                if (!nickname) {
                    wrong("닉네임을 입력하세요");
                    setCheckingNickname(0);
                    return;
                }
                const nicknames = userList.map(user => user.nickname);
                if (nicknames.includes(nickname)) {
                    wrong("닉네임이 중복됩니다.");
                    setCheckingNickname(0);
                    return;
                }
                correct("닉네임 사용 가능합니다!");
                setCheckingNickname(1);
                return;
            }).catch(error => {
                console.error('Error fetching nicknames:', error);
            });
    }
    // 전화번호
    const [tel, setTel] = useState('');
    const handleTel = (e) => { setTel(e.target.value); setCheckingTel(0); };

    useEffect(() => {
        if (tel) {
            let telValue = tel.replace(/[^0-9]/g, '').toString(); // 숫자 이외의 문자 제거
            if (telValue.length > 11) { telValue = telValue.slice(0, 11); }
            if (telValue.length === 11) {
                telValue = telValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (telValue.length === 13) {
                telValue = telValue.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            }
            setTel(telValue);
            setCheckingTel(0);
        }
    }, [tel]);

    const checkTel = () => {
        axios.get('/user/tel', {
            params: {
                email: email
            }
        })
            .then(response => {
                const userList = response.data; // 응답 데이터 전체를 가져옵니다.
                if (!userList) {
                    console.error('User list is undefined or null');
                    return;
                }
                if (tel.length !== 13) {
                    wrong("전화번호가 잘못되었습니다.");
                    setCheckingTel(0);
                    return;
                }
                const tels = userList.map(user => user.tel);
                if (tels.includes(tel)) {
                    wrong("전화번호가 중복됩니다.");
                    setCheckingTel(0);
                    return;
                }
                correct("사용 가능한 전화번호입니다.");
                setCheckingTel(1);
                // setVerify(1);
                return;

            }).catch(error => {
                console.error('Error fetching tels:', error);
            });
    }

    const auth = getAuth();

    function handleKeyPress(event) {
        if (event && event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    }

    const handleChange = e => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }

    const handeluname = e => {
        setUname(e.target.value);
    }

    const handleSubmit = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(com|net)$/;

        if (!emailRegex.test(userInfo.email)) {
            wrong("올바른 이메일 형식이 아닙니다.");
            return;
        }
        if (userInfo.pwd !== userInfo.confirmPassword) {
            wrong("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (userInfo.pwd.length < 6) {
            wrong("비밀번호는 6자리 이상이어야 합니다.");
            return;
        }

        if (!/[0-9]/.test(userInfo.pwd) || !/[!@#$%^&*?]/.test(userInfo.pwd)) {
            Swal.fire({
                width: '50%',
                title: '유효성 검사 경고',
                html: `비밀번호는 숫자와 특수문자(!@#$%^&amp;*?)를 포함해야합니다.`,
                icon: 'warning'
            });
            return;
        }

        if (uname === '') { wrong("이름을 입력하세요"); return; }
        if (checkingNickname === 0) { wrong("닉네임 중복 확인을 해주세요"); return; }
        if (checkingTel === 0) { wrong("전화번호 인증을 해주세요"); return; }
        if (checkingBirth === 0) { wrong("생년월일 확인을 해주세요."); return; }

        await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.pwd)
            .then(async () => {
                console.log(userInfo.email, userInfo.pwd, uname, nickname, tel, birth);
                Swal.fire({
                    title: "가입에 성공하셨습니다!",
                    text: "OK 버튼을 눌러주세요!",
                    icon: "success"
                }).then(() => {
                    closeModal(); // 모달 닫기
                });

                const sendData = {
                    hashuid: 'nonGoogle',
                    provider: 0,
                    email: userInfo.email,
                    pwd: userInfo.pwd,
                    birth: birth,
                    uname: uname,
                    nickname: nickname,
                    tel: tel
                };
                try {
                    userRegister(sendData);
                } catch (error) {
                    console.log(error);
                }
                setTimeout(() => {
                    navigate('/authentication/sign-in');
                }, 1000);
            })
            .catch(error => {
                console.error("회원가입 에러:", error.message);
                if (error.code === "auth/email-already-in-use") {
                    Swal.fire({
                        title: '이미 사용중인 이메일입니다.',
                        text: "다른 이메일을 입력해주세요.",
                        icon: "warning"
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "가입에 실패하셨습니다.",
                        text: "회원가입 도중 오류 발생",
                    });
                }
            });
    }

    return (
        <div className="register-container">
            <input type="email" name='email' placeholder="이메일을 입력하세요"
                className="commonInputStyle_Modal" onKeyUp={handleKeyPress} onChange={handleChange} />

            <div className="input-container">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name='pwd'
                    placeholder="비밀번호 입력"
                    className="commonInputStyle_Modal"
                    onKeyUp={handleKeyPress}
                    onChange={handleChange}
                />
                <i
                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
                    onClick={() => setShowPassword(!showPassword)}
                />
            </div>

            <div className="input-container">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    placeholder="비밀번호 입력 확인"
                    className="commonInputStyle_Modal"
                    onKeyUp={handleKeyPress}
                    onChange={handleChange}
                />
                <i
                    className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />

            </div>
            <div className="input-container" >
                <input type="uname" name='uname' placeholder="이름을 입력하세요"
                    className="commonInputStyle_Modal" onKeyUp={handleKeyPress} onChange={handeluname} />
            </div>
            <div className="input-container" >
                <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Grid item xs={9.5}>
                        <LightTooltip title="별명을 입력하세요." >
                            <input
                                label="닉네임"
                                className="commonInputStyle_Modal"
                                placeholder="닉네임을 입력하세요"
                                value={nickname || ''}
                                onChange={handleNickname}
                                onKeyUp={handleKeyPress}
                            />
                        </LightTooltip>
                    </Grid>
                    <Grid item xs={0.7}>
                        <Button onClick={checkNickname} variant="contained" sx={{
                            backgroundColor: 'rgb(98, 0, 234)', p: 0, mt: 0.9,
                            '&:hover': { backgroundColor: 'rgb(54, 30, 150)' }
                        }} style={{ color: 'white' }} >확인</Button>
                    </Grid>
                    <Grid item xs={1.8}><div></div></Grid>
                </Grid>
            </div>

            <div style={{marginTop:-1}} className="input-container" >
                <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Grid item xs={9.5}>
                        <LightTooltip title="' - ' 없이 숫자만 입력하세요."  >
                            <input
                                className="commonInputStyle_Modal"
                                placeholder="전화번호를 입력하세요"
                                name="tel"
                                value={tel || ''}
                                onChange={handleTel}
                                onKeyUp={handleKeyPress}
                                style={{ marginTop: 10, width: '100%' }}
                            />
                        </LightTooltip>
                    </Grid>
                    <Grid item xs={0.7}>
                        <Button onClick={checkTel} variant="contained" sx={{
                            backgroundColor: 'rgb(98, 0, 234)', p: 0, mt: 1,
                            '&:hover': { backgroundColor: 'rgb(54, 30, 150)' }
                        }} style={{ color: 'white' }} >확인</Button>
                    </Grid>
                    <Grid item xs={1.8}>
                    </Grid>
                </Grid>
                <div>
                    {verify === 1 ?
                        <SmsLogin handleKeyPress={handleKeyPress} tel={tel} setCheckingTel={setCheckingTel} />
                        : <></>}
                </div>

            </div>

            <div style={{ marginTop: -2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item xs={9.3}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    onChange={handleBirth}
                                    slots={{ textField: TextField }}
                                    value={birth ? dayjs(birth) : null}
                                    formatDensity="spacious"
                                    format="YYYY/MM/DD"
                                    variant='outlined'
                                />
                            </DemoContainer>
                        </Grid>
                        <Grid item xs={0.7}>
                            <Button
                                onClick={checkBirth}
                                variant="contained" sx={{
                                    backgroundColor: 'rgb(98, 0, 234)', p: 0, mt: 1.2,
                                    '&:hover': { backgroundColor: 'rgb(54, 30, 150)' }
                                }} style={{ color: 'white' }} >확인</Button>
                        </Grid>
                        <Grid item xs={1}><div></div></Grid>
                    </Grid>
                </LocalizationProvider>
            </div>
            <Button sx={{
                backgroundColor: 'rgb(98, 0, 234)', p: 0, mt: 1.2,
                '&:hover': { backgroundColor: 'rgb(54, 30, 150)' }
            }} onClick={handleSubmit} style={{ color: 'white', width: '100%' }}>가입하기</Button>
            <Divider style={{ opacity: 1, border: 2 }} />
            <Icon onClick={closeModal} className="close-modal-button">close</Icon>
        </div>
    );
}

Register.propTypes = {
    closeModal: PropTypes.func,
    nickname: PropTypes.string,
    email: PropTypes.string,
};