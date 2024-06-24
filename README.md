readme 틀 짜고 있는중입니다.
# <span id="top"> Flownary </span>
<img width="840" height="600" src="https://github.com/JuyoungKwak0618/FlownaryReact/assets/155405909/bdfe39bb-3b23-421b-a3b2-4e11cc912a61">

# 소개 및 개요

프로젝트 기간: 2024-04-16 ~ 2024-06-14<br/>
인원: 6인 (FE 4, BE 1, DB 1)<br/>
주제: SNS 사이트 만들기<br/>
사용 언어: JS (React)<br/>

<table>
    <tr>
        <td align="center">
            <img src="https://github.com/JuyoungKwak0618/FlownaryReact/assets/155405909/baaede75-c7b1-4af9-9839-fd6b0365961c" height="180" width="180">
            <br>
            <strong>👑 이병학</strong>
            <br>
            <strong>github:</strong> [링크]
            <br>
            <div style="display: flex; align-items: center;">
    <img src="https://img.shields.io/badge/-Team%20Leader-yellow" style="margin-right: 10px;">
    <img src="https://img.shields.io/badge/BackEnd-404040">
</div>
        </td>
        <td align="center">
            <img src="https://github.com/JuyoungKwak0618/FlownaryReact/assets/155405909/5a5660a3-ac07-4c39-a792-944ee1edbd83" height="180" width="180">
            <br>
            <strong>💻 윤영준</strong>
            <br>
            <strong>github:</strong> [링크]
            <br>
            <img src="https://img.shields.io/badge/DataBase-008000">
        </td>
        <td align="center">
            <img src="https://github.com/JuyoungKwak0618/FlownaryReact/assets/155405909/5eb5bde5-261d-4e4c-ba43-11c1d0c2de05" height="180" width="180">
            <br>
            <strong>📈 이윤주</strong>
            <br>
            <strong>github:</strong> [링크]
            <br>
            <img src="https://img.shields.io/badge/-Work%20Management%20-f67280">
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="https://github.com/JuyoungKwak0618/FlownaryReact/assets/155405909/f15f0994-9331-4ce4-87b9-c83ce4d47ef1" height="180" width="180">
            <br>
            <strong>🎨 곽주영</strong>
            <br>
            <strong>github:</strong> [링크]
            <br>
            <img src="https://img.shields.io/badge/FrontEnd-007acc">
        </td>
        <td align="center">
            <img src="https://github.com/JuyoungKwak0618/FlownaryReact/assets/155405909/c3402f3d-4b2b-4200-a4fc-b6d2d4b7b9a6" height="180" width="180">
            <br>
            <strong>🎨 정성한</strong>
            <br>
            <strong>github:</strong> [링크]
            <br>
            <img src="https://img.shields.io/badge/FrontEnd-007acc">
        </td>
        <td align="center">
            <img src="https://github.com/JuyoungKwak0618/FlownaryReact/assets/155405909/563dd1c4-4ecc-4aa2-a638-396107328e04" height="180" width="180">
            <br>
            <strong>🎨 안순현</strong>
            <br>
            <strong>github:</strong> [링크]
            <br>
            <img src="https://img.shields.io/badge/FrontEnd-007acc">
        </td>
    </tr>
</table>


### [프로젝트 개요]
본 프로젝트는 SNS 소셜 네트워크 플랫폼의 현재와 과거의 이용률을 분석하고, 4060세대의 활발한 SNS 활동을 반영하여, 전 세계의 다양한 연령층이 소통할 수 있는 최적의 플랫폼을 제공하는 것을 목표로 합니다. 특히 실버세대를 포함한 모든 세대에게 적합하고, 사용 편의성과 트렌디한 UI 디자인에 중점을 둔 서비스를 구현합니다.

### 주요 기능
* 게시물 관리의 간편함: 사용자가 올린 게시글의 사진을 앨범 카테고리로 모아보고, 홈에서는 글쓰기와 게시물이 한눈에 들어오도록 구성합니다.
* TO DO LIST: 사용자가 할 일을 관리하고 추적할 수 있는 기능을 제공하여 생산성을 높입니다.
* 채팅: 사용자 간 실시간으로 소통할 수 있는 채팅 기능을 제공하고 홈 화면에서 채팅 위젯을 바로 접근할 수 있도록 배치하였습니다.

## Pages(route)
#### home 홈
게시글 목록, 게시글 작성을 겸합니다
#### login 로그인
#### chatting 채팅
채팅방 목록과 채팅 내용을 표시합니다
#### chattingtemp 임시채팅
아직 채팅방이 만들어지지 않은 유저들끼리 채팅방을 만들기 전 채팅방 제목과 첫 채팅만 보내기 위해 제작된 페이지입니다
#### mypage 마이페이지
그냥 들어갈 경우 현재 로그인한 유저의 마이페이지, 타인의 프로필을 클릭하면 타인의 마이페이지가 나옵니다
#### family 패밀리
#### follow 플로우(팔로우)
타 SNS의 팔로우와 거의 유사한 기능으로, 해당 페이지는 자신의 팔로워, 팔로잉 목록을 볼 수 있습니다
#### album 앨범
#### notification 알림
#### verify 인증
설정에 들어가기 전 비밀번호를 입력하는 페이지입니다
#### setting 유저 설정
유저의 개인정보나 프로필 사진을 수정하는 공간입니다
#### team 팀
팀 소개 페이지입니다
#### search 검색
게시글 검색 페이지
#### statistics 이용 통계 (관리자 전용)
이용자의 글 작성 등의 통계 제공 페이지입니다
#### userList 사용자 관리 (관리자 전용)
이용자의 비활성화/활성화를 할 수 있는 관리자 전용 페이지입니다
#### boardList 게시물 관리 (관리자 전용)
글에 대한 신고와 글 목록에 대한 처리를 할 수 있는 페이지입니다


### 기타
1. 최상위 경로에 env.local로 특정 키 등의 정보 필요합니다. 필요한 정보는 아래와 같습니다
- Firebase : REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET, REACT_APP_FIREBASE_MESSAGING_SEMDER_ID, REACT_APP_FIREBASE_APP_ID
- Cloudinary : REACT_APP_CLOUDINARY_CLOUD_NAME, REACT_APP_CLOUDINARY_UPLOAD_PRESET, REACT_APP_CLOUDINARY_URL
- React : REACT_APP_API_KEY
- Kakao : YOUR_KAKAO_REST_API_KEY (java key)
- GENERATE_SOURCEMAP
- websocket : REACT_APP_WEBSOCKET_URL
- REACT_APP_ADDRESS
2. Spring Boot와 연계하여 사용할 경우 서버의 IP에 대한 웹소켓 연결을 Proxy.js로 하는 것이 필요합니다

