import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button } from "@mui/material";
import { correct, wrong } from "api/alert";
import { getApp, getApps, initializeApp } from "firebase/app";

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
export const auth = getAuth(app);

export default function SmsLogin({ handleKeyPress, tel, setCheckingTel }) {
    const [value, setValue] = useState("");
    const [verify, setVerify] = useState('');
    const [timer, setTimer] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isTimerActive) {
            setTimer(180); // 3분(180초) 타이머 설정
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        wrong("인증 시간이 만료되었습니다. 다시 시도해 주세요.");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerActive]);

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.startsWith("010")) {
            const restOfNumber = phoneNumber.slice(1).replace(/-/g, "");
            return "+82" + restOfNumber;
        }
        return phoneNumber;
    };

    const handleVerify = e => {
        setVerify(e.target.value);
    };

    const onClickHandle = () => {
        const phoneNumber = formatPhoneNumber(tel); // 전화번호 형식 변환
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
                console.log('recaptcha resolved..')
            }
        });
        setIsTimerActive(true); // 타이머 시작

        // signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        //     .then((confirmationResult) => {
        //         window.confirmationResult = confirmationResult; // 확인 결과 저장
        //         correct("문자를 성공적으로 전송하였습니다!");
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         wrong("문자를 전송하지 못했습니다. 번호를 확인해주세요.");
        //     });
    };

    const onClickHandle2 = () => {
        if (!isTimerActive) {
            wrong("인증 시간이 만료되었습니다. 다시 시도해 주세요.");
            return;
        }

        const code = verify;
        window.confirmationResult
            .confirm(code)
            .then((result) => {
                const user = result.user;
                correct("인증에 성공하셨습니다");
                setCheckingTel(1);
            })
            .catch((error) => {
                wrong("인증번호가 올바르지 않습니다.");
            });
    };

    return (
        <>
            <div id="recaptcha-container"></div>
            <input
                name="confirmPassword"
                placeholder="인증번호를 입력하세요"
                className="commonInputStyle_Modal"
                onKeyUp={handleKeyPress}
                onChange={handleVerify}
                style={{ width: '100%' }}
            />
            <br />
            <Button
                onClick={onClickHandle}
                variant="contained"
                sx={{
                    backgroundColor: 'rgb(54, 11, 92)',
                    p: 1.5,
                    mr: 1.5,
                    '&:hover': { backgroundColor: 'rgb(54, 30, 150)' },
                }}
                style={{ color: 'white' }}
            >
                문자보내기
            </Button>

            <Button
                onClick={onClickHandle2}
                variant="contained"
                sx={{
                    backgroundColor: 'rgb(54, 11, 92)',
                    p: 1.5,
                    mr: 1.5,
                    '&:hover': { backgroundColor: 'rgb(54, 30, 150)' },
                }}
                style={{ color: 'white' }}
                disabled={!isTimerActive}
            >
                인증번호 확인하기
            </Button>

            {isTimerActive && (
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                    남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초
                </div>
            )}
        </>
    );
}

SmsLogin.propTypes = {
    handleKeyPress: PropTypes.func.isRequired,
    tel: PropTypes.string.isRequired,
    setCheckingTel: PropTypes.func.isRequired
};
