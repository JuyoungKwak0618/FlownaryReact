import axios from "axios";
import { useEffect, useState } from "react";
import { GetWithExpiry } from "./LocalStorage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFollow, insertBoard, insertReReply, insertReply, like, userUpdate } from "./axiosPost";

/** 미사용 함수
 * @param {*} uid 
 * @returns 
 */
export const useGetUser = async (uid) => {
    const result = await axios.get('/user/getUser', {
        params: {
            uid: uid
        }
    }).then(res => res.data
    ).catch(error => console.log(error));
    return result.data;
}

/** Localstorage에 저장된 uid(현재 접속한 유저 번호) 값을 이용해서 nickname 불러오기
 * @returns 닉네임
 */
export function useGetUserNicknameLS() {
    const uid = GetWithExpiry("uid");

    const { isLoading, data } = useQuery({
        queryKey: ['getNickname'],
        queryFn: async () => {
            const res = await axios.get('/user/getUser', {
                params: {
                    uid: uid,
                }
            });

            return res.data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    if (!isLoading && data != null && (data.nickname == null || data.nickname == '')) {
        return data.email;
    }
    else if (!isLoading && data != null && (data.nickname != null && data.nickname != '')) {
        return data.nickname;
    }

    return null;
}

/* 좋아요 시 서버로 useMutation */
export const useAddLike = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: like,
        onSuccess: () => {
            queryClient.invalidateQueries('board'); // 갱신하고자 하는 queryKey를 넣어야 함
        },
    });

    return mutate;
}

/* 글 작성 시 서버로 useMutation */
export const useAddBoard = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: insertBoard,
        onSuccess: () => {
            queryClient.invalidateQueries('boardList');
        },
    });

    return mutate;
}

/* 댓글 작성 시 서버로 useMutation */
export const useAddReply = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: insertReply,
        onSuccess: () => {
            queryClient.invalidateQueries('replyList');
        },
    });

    return mutate;
}

/* 댓글 작성 시 서버로 useMutation */
export const useAddReReply = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: insertReReply,
        onSuccess: () => {
            queryClient.invalidateQueries('replyList');
        },
    });

    return mutate;
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: userUpdate,
        // onSuccess: () => {
        //     queryClient.invalidateQueries('replyList');
        // },
    });

    return mutate;
}

/** 팔로우 해제
 * @returns mutate
 */
export const useRemoveFollow = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteFollow,
        onSuccess: () => {
            queryClient.invalidateQueries('followlist');
            queryClient.invalidateQueries('followmelist');
        },
    });

    return mutate;
}