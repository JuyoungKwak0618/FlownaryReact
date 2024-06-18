import axios from "axios"
import { UploadImage } from "./image";

/** 유저번호로 유저 조회
 * @param {*} uid 유저번호 
 * @returns 
 */
export const getUser = async (uid: number) => {

    const result = await axios.get('/user/getUser', {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getUser error!');
            console.log(error);
        });

    return result;
}

/** 이메일로 유저 조회
 * @param {*} email 이메일
 * @returns 
 */
export const getUserEmail = async (email: string) => {

    const result = await axios.get('/user/getUserByEmail', {
        params: {
            email: email,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getUserEmail error!');
            console.log(error);
        });

    return result;
}

/** uid로 닉네임과 이메일, 프로필만 가지는 유저 정보 조회
 * @param {*} uid 유저 번호
 * @returns 
 */
export const getUserNickEmail = async (uid: number) => {

    const result = await axios.get(`/user/getUserNickEmail`, {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getUserNickEmail error!');
            console.log(error);
        });

    return result;
}

// 24/05/27 성한 - userList 추가(검토 필요!)
export const getUserList = async () => {
    try {
        const response = await axios.get('/user/getUserList');
        return response.data;
    } catch (error) {
        console.error('axiosGet.js: getUser Error!', error);
        return null;
    }
}

/** 유저가 특정 페이지를 렌더링 하는지의 여부 (웹소켓)
 * @param {*} uid 유저 번호
 * @param {*} page 페이지 이름
 * @returns 
 */
export const getUserOnPage = async (uid: number, page: string) => {
    const result = await axios.get(`/user/onPage`, {
        params: {
            uid: uid,
            page: page,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getUserOnPage error!');
            console.log(error);
        });

    return result; 
}

/** 글 조회
 * @param {*} bid 글 번호
 * @param {*} uid 현재 접속한 유저 번호 (기본값 -1)
 * @returns 
 */
export const getBoard = async (bid: Number, uid = -1) => {

    const result = await axios.get('/board/getBoard', {
        params: {
            bid: bid,
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getBoard error!');
            console.log(error);
        });

    return result;
}

/** shareUrl을 통해 글 조회
 * @param {*} url 글 공유 Url (10자리의 무작위 숫자+영대소문자로 구성됨)
 * @param {*} uid 현재 접속한 유저 번호 (기본값 -1)
 * @returns 
 */
export const getBoardUrl = async (url: string, uid = -1) => {
    const result = await axios.get('/board/getBoardUrl', {
        params: {
            url: url,
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getBoardUrl error!');
            console.log(error);
        });

    return result;
}

/** 글 리스트 받기
 * @param {*} count 보여줄 개수 (기본값 1)
 * @param {*} field 검색 분야 1 (기본값 'title')
 * @param {*} field2 분야 2 (기본값 '')
 * @param {*} field3 분야 3 (기본값 '')
 * @param {*} query 검색어 (기본값 '')
 * @param {*} type 검색 유형 (1: field 1개, 2: field 2개, 3: field 3개, 기본값 1)
 * @param {*} uid 현재 접속한 유저 번호 (기본값 -1)
 * @returns 
 */
export const getBoardList = async (count = 1, field = 'title', field2 = '', field3 = '', query = '', type = 1, uid = -1) => {
    const data = await axios.get('/board/list', {
        params: {
            c: count,
            f: field,
            f2: field2,
            f3: field3,
            q: query,
            type: type,
            uid: uid,
        },
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getBoardList error!');
            console.log(error);
        });
    return data;
};


/** 마이페이지 내 글 리스트 받기
 * @param {*} uid 현재 접속한 유저 번호 (기본값 -1)
 * @returns 
 */

export const getMyBoardList = async (uid) => {

    const result = await axios.get('/board/mylist', {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getMyBoardList error!');
            console.log(error);
        });

    return result;
}

/** 마이페이지 내가 좋아요 한 글 리스트 받기
 * @param {*} uid 현재 접속한 유저 번호 (기본값 -1)
 * @returns 
 */

export const getLikedBoardList = async (uid) => {
    try {
        const response = await axios.get('/board/likelist', {
            params: {
                uid: uid,
            }
        });
        return response.data;
    } catch (error) {
        console.log('axiosget.js: likelist error!');
        console.log(error);
        throw error;
    }
}

/** 댓글 리스트 받기
 * @param {*} bid 글 번호
 * @param {*} offset 맨 처음부터 보여주지 않을 개수 (ex: limit 20에 offset 10이면 11~20번째 글만 리턴)
 * @param {*} limit 개수 제한
 * @param {*} uid 현재 접속한 유저 번호
 * @returns  
*/
export const getReplyList = async (bid: Number, offset: Number, limit: Number, uid = Number) => {

    const result = await axios.get('/reply/list', {
        params: {
            bid: bid,
            offset: offset,
            limit: limit,
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getReplyList error!');
            console.log(error);
        });

    return result;
}

/** 대댓글 리스트 받기
 * @param {*} rid 댓글번호
 * @param {*} uid 현재 접속한 유저 번호
 * @returns 
 */
export const getReReplyList = async (rid: number, uid = -1) => {

    const result = await axios.get('/reply/re_list', {
        params: {
            rid: rid,
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getReplyList error!');
            console.log(error);
        });

    return result;
}

/** 검색어를 입력하여 받은 게시물의 총 개수 구하기
 * @param {*} field 검색 분야 1 (기본값 'title')
 * @param {*} field2 분야 2 (기본값 '')
 * @param {*} field3 분야 3 (기본값 '')
 * @param {*} query 검색어 (기본값 '')
 * @param {*} type 검색 유형 (1: field 1개, 2: field 2개, 3: field 3개, 기본값 1)
 * @param {*} uid 현재 접속한 유저 번호 (기본값 -1)
 * @returns 
 */
export const getBoardListCount = async (field = 'title', field2 = '', field3 = '', query = '', type = 1, uid = -1) => {

    const result = await axios.get('/board/listCount', {
        params: {
            f: field,
            f2: field2,
            f3: field3,
            q: query,
            type: type,
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getBoardListCount error!');
            console.log(error);
        });

    return result;
}


/** 채팅방 받기
 * @param {*} cid 채팅방 번호
 * @param {*} uid 현재 접속하고 있는 유저 번호
 * @returns 
 */
export const getChat = async (cid: number, uid = -1) => {

    const result = await axios.get('/chat/get', {
        params: {
            cid: cid,
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getChat error!');
            console.log(error);
        });

    return result;
}

/** 채팅방 리스트 받기
 * @param {*} uid 자신의 채팅방 리스트를 받을 유저번호
 * @param {*} count 개수 (기본값 1)
 * @param {*} status 채팅방 상태 (기본값 0)
 * @returns 
 */
export const getChatList = async (uid: number, count = 1, status = 0) => {

    const result = await axios.get('/chat/list', {
        params: {
            uid: uid,
            count: count,
            status: status,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getChatList error!');
            console.log(error);
        });

    return result;
}

/** 채팅유저 목록 받기
 * @param {*} cid 채팅방 번호
 * @returns 
 */
export const getChatUserList = async (cid: number) => {
    const result = await axios.get('/chat/userlist', {
        params: {
            cid: cid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getChatUserList error!');
            console.log(error);
        });

    return result;
}

/** 특정 유저 둘이 포함된 채팅방 번호 받기
 * @param {*} uid1 유저번호 1
 * @param {*} uid2 유저번호 2 
 * @returns 채팅방 번호, 없을 경우 -1 반환
 */
export const getChatCid = async (uid1: number, uid2: number) => {

    const result = await axios.get('/chat/getChatCid', {
        params: {
            uid1: uid1,
            uid2: uid2,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getChatCid error!');
            console.log(error);
        });

    return result;
}

/** 채팅 리스트 받기
 * @param {*} cid 채팅방 번호
 * @param {*} count 개수 (기본값 20)
 * @returns 
 */
export const getDmList = async (cid: number, count: 20) => {

    const result = await axios.get('/dmlist/list', {
        params: {
            cid: cid,
            count: count,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getDmList error!');
            console.log(error);
        });

    return result;
}

/** 특정 유저의 채팅 목록 받기
 * @param {*} uid 유저 번호
 * @param {*} count 개수 (기본값 20)
 * @returns 
 */
export const getDmListUid = async (uid: number, count: 20) => {

    const result = await axios.get('/dmlist/listUid', {
        params: {
            cid: cid,
            count: count,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getDmListUid error!');
            console.log(error);
        });

    return result;
}

/** 채팅 번호로 채팅방 번호 찾기
 * @param {*} did 채팅 번호
 * @returns 
 */
export const getDmCid = async (did: number) => {

    const result = await axios.get('/dmlist/getcid', {
        params: {
            did: did,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getDmCid error!');
            console.log(error);
        });

    return result;
}

/** 특정 유저가 팔로우한 팔로우 목록 리스트
 * @param {*} uid 유저 번호
 * @returns 
 */
export const getFollowList = async (uid: number) => {

    const result = await axios.get('/follow/getList', {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getFollowList error!');
            console.log(error);
        });

    return result;
}

/** 특정 유저'를' 팔로우한 팔로우 목록 리스트
 * @param {*} fuid 대상의 유저 번호
 * @returns 
 */
export const getFollowMeList = async (fuid: number) => {

    const result = await axios.get('/follow/getMyList', {
        params: {
            fuid: fuid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getFollowMeList error!');
            console.log(error);
        });

    return result;
}

/** 팔로우 수 구하기
 * @param {*} uid 유저 번호
 * @param {*} type 타입 (0일 경우 uid가 팔로우한 수, 1이면 uid를 팔로우한 수)
 * @returns 
 */
export const getFollowCount = async (uid: number, type: number) => {

    const result = await axios.get('/follow/getCount', {
        params: {
            uid: uid,
            type: type,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getFollowCount error!');
            console.log(error);
        });

    return result;
}

/** 특정 유저가 받은 좋아요 수
 * @param {*} fuid 대상 유저 번호
 * @param {*} type 유형 (1: 게시글, 2: 댓글, 3: 대댓글, 0: 전체)
 * @returns 
 */
export const getLikeUid = async (fuid: number, type = 1) => {

    const result = await axios.get('/like/count', {
        params: {
            fuid: fuid,
            type: type,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getLikeUid error!');
            console.log(error);
        });

    return result;
}

/** 특정 대상의 좋아요 수
 * @param {*} type 유형 (1: 게시글, 2: 댓글, 3: 대댓글)
 * @param {*} oid 오브젝트 번호 (게시글일 경우 bid)
 * @returns 
 */
export const getLikeList = async (type: number, oid: number) => {

    const result = await axios.get('/like/list', {
        params: {
            type: type,
            oid: oid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getLikeList error!');
            console.log(error);
        });

    return result;
}

/** 활성화 된 알림 목록 받기
 * @param {*} uid 유저 번호
 * @param {*} type 유형 (기본값 0)
 * 0: 전체
 * 1: 팔로잉한 사람이 게시물 작성 시
 * 2: 자신의 게시물에 댓글이 달릴 시
 * 3: 타인이 자신을 팔로잉 했을 시
 * 4: Dm(개인 메세지)을 받았을 시
 * @returns 
 */
export const getNoticeList = async (uid: number, type = 0) => {

    const result = await axios.get('/notice/list', {
        params: {
            uid: uid,
            type: type,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getNoticeList error!');
            console.log(error);
        });

    return result;
}

/** 활성화 된 알림 개수
 * @param {*} uid 유저 번호
 * @returns 
 */
export const getNoticeCount = async (uid: number) => {

    const result = await axios.get('/notice/count', {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getNoticeCount error!');
            console.log(error);
        });

    return result;
}

/** uid를 이용하여 특정 조건의 알림 받기
 * @param {*} uid 알림을 받은 유저 번호
 * @param {*} suid 알림을 전송한 유저 번호
 * @param {*} type 유형
 * @param {*} oid 오브젝트 번호
 * @returns 
 */
export const getNoticeUid = async (uid: number, suid: number, type: number, oid: number) => {
    const result = await axios.get('/notice/get', {
        params: {
            uid: uid,
            suid: suid,
            type: type,
            oid: oid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getNoticeUid error!');
            console.log(error);
        });

    return result;
}

/** getNoticeUid와 같은 조건에서 알림이 있는지의 여부 확인
 * @param {*} uid 알림을 받은 유저 번호
 * @param {*} suid 알림을 전송한 유저 번호
 * @param {*} type 유형
 * @param {*} oid 오브젝트 번호
 * @returns 1: 알림 있음, 0: 알림 없음
 */
export const getNoticeCheck = async (uid: number, suid: number, type: number, oid: number) => {
    const result = await axios.get('/notice/getcheck', {
        params: {
            uid: uid,
            suid: suid,
            type: type,
            oid: oid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getNoticeCheck error!');
            console.log(error);
        });

    return result;
}

/** 채팅에 대한 알림 개수 세기
 * @param {*} uid 유저 번호
 * @returns 
 */
export const getNoticeCountChat = async (uid: number) => {

    const result = await axios.get('/notice/chatcount', {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getNoticeCountChat error!');
            console.log(error);
        });

    return result;
}


/** Todo 목록 보기
 * @param {*} tid todo 번호
 * @param {*} uid 접속한 유저 번호
 * @param {*} contents 내용
 * @param {*} pri 우선 순위;
 * @returns 
 */
export const getTodoList = async (uid: number) => {

    const result = await axios.get('/todo/list', {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getNoticeList error!');
            console.log(error);
        });

    return result;
}


/** 패밀리 받기
 * @param {*} faid 패밀리 번호 
 * @returns 패밀리 정보
 */
export const getFamily = async (faid: number) => {

    const result = await axios.get('/family/get', {
        params: {
            faid: faid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getFamily error!');
            console.log(error);
        });

    return result;
}

/** 특정 유저의 패밀리 소속 여부 알아내기
 * @param {*} faid 패밀리 번호
 * @param {*} uid 유저 번호
 */
export const getFamilyUser = async (faid: number, uid: number) => {

    const result = await axios.get('/family/getuser', {
        params: {
            faid: faid,
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getFamilyUser error!');
            console.log(error);
        });

    return result;
}

/** 특정 유저의 패밀리 리스트 받기
 * @param {*} uid 유저 번호
 * @returns 
 */
export const getFamilyList = async (uid: number) => {

    const result = await axios.get('/family/list', {
        params: {
            uid: uid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getFamilyList error!');
            console.log(error);
        });

    return result;
}

/** 특정 패밀리의 유저 리스트 받기
 * @param {*} faid 패밀리 번호
 * @returns 
 */
export const getFamilyUserList = async (faid: number) => {

    const result = await axios.get('/family/userlist', {
        params: {
            faid: faid,
        }
    }).then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getFamilyUserList error!');
            console.log(error);
        });

    return result;
}



/** Declaration 목록 보기
 * @returns 
 */
export const getDeclarationList = async () => {

    const result = await axios.get('/declaration/list').then((response) => response.data)
        .catch(error => {
            console.log('axiosget.js: getDeclarationList error!');
            console.log(error);
        });

    return result;
}



