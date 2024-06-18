import React, { useContext, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "api/LocalStorage";

const Logout = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { updateActiveUser } = useContext(UserContext);

  useEffect(() => {
    signOut(auth).then(() => {
      sessionStorage.clear();
      updateActiveUser({
        uid: -1, email: "", nickname: "", uname: "",
        role: 0, profile: "",
      });
      navigate('/');
    })
      .catch((error) => {
        console.error('로그아웃 오류:', error);
      });
  }, [auth, navigate]);

  return <div>로그아웃 중...</div>;
};

export default Logout;