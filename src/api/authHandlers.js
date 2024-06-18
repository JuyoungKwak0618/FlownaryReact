import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import axios from "axios";

export async function handleSubmit(e, userInfo, auth, navigate, login) {
    e.preventDefault();

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

        const user = await signInWithEmailAndPassword(auth, userInfo.email, userInfo.password);

        if (user) {
            login(userInfo);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "로그인에 성공하였습니다!",
                showConfirmButton: false,
                timer: 1200
            });
            axios.get('/user/login', {
                params: {
                    // 여기에 필요한 파라미터를 채워 넣습니다.
                }
            });
            navigate('/');
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "앗! 잠시만요",
            text: "이메일 혹은 비밀번호가 맞지 않아요.",
            footer: '<a href="register">혹시 계정이 없으신가요?</a>'
        });
        console.error(error);
    }
}
