import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "layouts/home/HomeIndex";

const UserContext = createContext(null);


export function SetWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl * 1000 * 60,
    }
    sessionStorage.setItem(key, JSON.stringify(item));
}

export function GetWithExpiry(key) {
    const itemStr = sessionStorage.getItem(key);

    if (!itemStr) {
        if (key === "uid") return -1;
        if (key === "nickname") return "";
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (!item.value) {
        sessionStorage.removeItem(key);
        if (key === "uid") return -1;
        if (key === "nickname") return "";
        return null;
    }

    if (now.getTime() > parseInt(item.expiry)) {
        sessionStorage.removeItem(key);
        if (key === 'uid') {
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("profile");
            sessionStorage.removeItem("nickname");
            sessionStorage.removeItem("uname");
            sessionStorage.removeItem("statusMessage");
            sessionStorage.removeItem("role");
            // window.location.reload();
            return -1;
        }
        return null;
    }

    return item.value;
}

const ContextProvider = ({ children }) => {
    const [activeUser, setActiveUser] = useState({
        uid: -1,
        email: '',
        nickname: '',
        uname: '',
        role: 0,
        profile: '',
    });

    const updateActiveUser = (user) => {
        setActiveUser(user);
    }

    useEffect(() => {
        const uid = GetWithExpiry("uid");
        const email = GetWithExpiry("email");
        const nickname = GetWithExpiry("nickname");
        const uname = GetWithExpiry("uname");
        const profile = GetWithExpiry("profile") ? GetWithExpiry("profile") : null;
        const statusMessage = GetWithExpiry("statusMessage");
        const role = GetWithExpiry("role") ? GetWithExpiry("role") : 0;


        setActiveUser({ uid, email, nickname, uname, profile, statusMessage, role });
    }, []);

    return (
        <UserContext.Provider value={{ activeUser, updateActiveUser }}>
            {children}
        </UserContext.Provider>
    );
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext, ContextProvider };