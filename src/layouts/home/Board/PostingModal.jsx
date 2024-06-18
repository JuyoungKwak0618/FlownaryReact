// 기본
import React, { useEffect, useState } from "react";
import { Card, Stack, Button, Grid, Modal, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 아코디언
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

// 이모티콘
import InputEmoji from 'react-input-emoji'

// 아이콘
import CreateIcon from '@mui/icons-material/Create';

// css 연결
import './posting.css';
import { AntSwitch } from './postingStyle.jsx';
import { UploadImage } from "api/image.js";
// import { FindImage, UploadImage2 } from "../../api/image.js";
import { GetWithExpiry } from "api/LocalStorage.js";


export default function Posting() {
    const navigate = useNavigate();

    const uid = parseInt(GetWithExpiry("uid"));

    // uid가 로컬스토리지에 없으면 로그인 창으로 이동
    if (!uid) {
        navigate("/login");
    }
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        if (uid !== null) {
            axios.get('/user/getUser', {
                params: {
                    uid: uid,
                }
            }).then(res => {
                if (res.data.nickname !== null && res.data.nickname !== '') {
                    setNickname(res.data.nickname);
                }
                else {
                    setNickname(res.data.email);
                }
            }).catch(error => console.log(error));
        }
    }, [uid]); // 종속성 배열에서 uid 제거


    // 창열고 닫기
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // 아코디언
    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    // 이미지 파일 불러오기
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    // 글 내용
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');

    // 파일이 선택되었을 때 호출되는 함수
    const handleFileChange = async (event) => {
        if (event.target.files.length === 0) {
            return;
        }

        // 이미지가 5개를 초과하지 않도록 확인
        if (event.target.files.length + images.length > 5) {
            alert('최대 5개의 이미지만 업로드할 수 있습니다.');
            return;
        }

        const selectedFiles = Array.from(event.target.files);
        setImages(images.concat(selectedFiles)); // 기존 이미지 배열에 추가

        const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(previewUrls.concat(newPreviewUrls)); // 미리보기 URL 배열에 추가
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        handleClose();

        const imageList = await Promise.all(
            images.map(async (image) => {
                const url = await UploadImage(image);
                return url.public_id;
            })
        );

        var sendData = JSON.stringify({
            uid: uid,
            title: title,
            bContents: text,
            image: imageList.toString(),
            nickname: nickname,
            shareUrl: 'http://localhost:3000/',
            hashTag: null
        })

        axios({
            method: "POST",
            url: '/board/insert',
            data: sendData,
            headers: { 'Content-Type': 'application/json' }
        }).catch(error => console.log(error));

        setImages([]);
        //setImageList([]);
        setText('');
        setTitle('');
        setPreviewUrls([]);
    };

    // 이미지 삭제 핸들러
    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index)); // 이미지 배열에서 삭제
        setPreviewUrls(previewUrls.filter((_, i) => i !== index)); // 미리보기 URL 배열에서 삭제
    };

    function handleOnEnter(text) { console.log('enter', text) }

    return (
        <>
            {/* 기존의 버튼 및 아이콘 */}
            <button className='asideStyle' onClick={handleOpen}>
                <Grid container>
                    <Grid item xs={12} lg={6} sx={{ display: { xs: 'flex', lg: 'flex' }, pl: 3 }}>
                        <CreateIcon className='iconStyle' />
                    </Grid>
                    <Grid item xs={0} lg={6} sx={{ color: 'rgb(58, 0, 85)', display: { xs: 'none', lg: 'flex' }, pr: 3, justifyContent: 'flex-end' }}>
                        글쓰기
                    </Grid>
                </Grid>
            </button>

            {/* 글쓰기 모달 */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box className='modalStyle'>
                    {/* 모달의 상단에 있는 헤더 부분 */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
                        <Button color="primary" onClick={handleClose}>창 닫기</Button>
                        <Typography variant="h6" component="h2" fontWeight="bold">새 게시물 만들기</Typography>
                        <Button onSubmit={handleFormSubmit} color="primary">작성</Button>
                    </Stack>

                    {/* 구분선 */}
                    <hr style={{ opacity: '0.5' }} />

                    {/* 이미지 업로드 및 미리보기 */}
                    <Stack direction="row">
                        <Stack direction="column" sx={{ flex: 1 }}>

                            <Button variant="outlined" component="label" sx={{ color: 'blue' }}>
                                이미지 추가하기
                                <input
                                    type="file"
                                    multiple
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>


                            {/* 이미지 미리보기 */}
                            <Grid container spacing={2}>
                                {previewUrls.map((url, index) => (
                                    <Grid item key={index}  xs={12} sm={4} lg={5}>
                                        <Card>
                                            <img src={url} alt={`Preview ${index}`} style={{ width: '15.5vh', height: '15vh', objectFit: 'fill' }} />
                                            <Button style={{ justifyContent: 'center' }} onClick={() => handleRemoveImage(index)}>
                                                제거
                                            </Button>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                        </Stack>

                        {/* 제목 작성 부분 */}
                        <Stack direction="column">

                            <InputEmoji
                                value={title}
                                onChange={setTitle}
                                cleanOnEnter
                                onEnter={handleOnEnter}
                                placeholder="제목을 입력하세요..."
                                shouldReturn
                                fontSize={15}
                                language='kr'
                            />


                            <InputEmoji
                                value={text}
                                onChange={setText}
                                // cleanOnEnter
                                // onEnter={handleOnEnter}
                                placeholder="문구를 입력하세요..."
                                shouldReturn
                                fontSize={15}
                                language='kr'
                            />


                            {/* 위치 */}
                            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                    <Typography>위치 추가</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        카카오 맵 API 지도 생성
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>


                            {/* 게시물 공개 비공개 */}
                            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                    <Typography>게시글 공개 혹은 비공개 </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ display: 'flex' }}>
                                    <Typography sx={{ marginRight: '1em' }}>비공개</Typography>
                                    <AntSwitch sx={{ marginTop: '0.25em' }} defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                                    <Typography sx={{ marginLeft: '1em' }}>공개</Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Stack>
                    </Stack>
                </Box>

            </Modal >
        </>
    );
}
