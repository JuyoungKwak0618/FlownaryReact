// reply, rereply 용 
import axios from "axios";
import { useEffect, useState } from "react";

export function useGetBoardList(count, update) {
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        if (count > 0) {
            axios.get('/board/list', {
                params: {
                    c: count,
                }
            }).then(res => {
                const formData = res.data.map(item => ({
                    title: item.title,
                    bContents: item.bContents,
                    image: item.image.split(','),
                    modTime: item.modTime,
                    likeCount: item.likeCount,
                    replyCount: item.replyCount,
                    uid: item.uid,
                    bid: item.bid,
                    nickname: item.nickname,
                    profile: item.profile,
                }));
                setDataList(formData);
            })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [update])

    return dataList;
}

export function useGetBoard(bid: int, open: Boolean, update: Boolean) {
    const [board, setBoard] = useState({});

    useEffect(() => {
        if (bid != null && open == true) {
            axios.get('/board/getBoard', {
                params: {
                    bid: bid
                }
            }).then(res => {
                const formData = {
                    title: res.data.title,
                    bContents: res.data.bContents,
                    image: res.data.image.split(','),
                    modTime: res.data.modTime,
                    likeCount: res.data.likeCount,
                    replyCount: res.data.replyCount,
                    uid: res.data.uid,
                    bid: res.data.bid,
                    profile: res.data.profile,
                }
                setBoard(formData);
            }).catch(error => console.log(error));

        }
    }, [open, update])

    return board;
}

export function useGetReplyList(bid: int, open: Boolean, update: Boolean, count: int) {
    const [replyList, setReplyList] = useState([]);

    useEffect(() => {
        if (bid != null && open == true) {
            axios.get('/board/replyList', {
                params: {
                    bid: bid,
                    offset: 0,
                    limit: count
                }
            })
                .then(res => {
                    const formData = res.data.map(item => ({
                        rid: item.rid,
                        rContents: item.rContents,
                        modTime: item.modTime,
                        likeCount: item.likeCount,
                        nickname: item.nickname,
                        profile: item.profile,
                    }));
                    setReplyList(formData);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [open, update])

    return replyList;
}


export function useGetBoardByUrl(url: String) {
    const [board, setBoard] = useState({});

    useEffect(() => {
        if (url != null && url != '') {
            axios.get('/board/getBoardUrl', {
                params: {
                    url: url
                }
            }).then(res => {
                const formData = {
                    title: res.data.title,
                    bContents: res.data.bContents,
                    image: res.data.image.split(','),
                    modTime: res.data.modTime,
                    likeCount: res.data.likeCount,
                    replyCount: res.data.replyCount,
                    uid: res.data.uid,
                    bid: res.data.bid,
                    profile: res.data.profile,
                }
                setBoard(formData);
            }).catch(error => console.log(error));
        }
    }, [url])

    return board;
}

