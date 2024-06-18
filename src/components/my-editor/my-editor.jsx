// src/components/my-editor/my-editor.jsx
import React, { useEffect, useState } from 'react';
import { EditorState, AtomicBlockUtils, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './my-editor.css';
import { UploadImage } from '../../api/image.js';
import Media from './media';
import { Button, Icon, Typography } from '@mui/material';
import draftToHtml from 'draftjs-to-html';
import './my-editor-switch'
import { styled, Switch } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { GetWithExpiry } from 'api/LocalStorage';
import axios from 'axios';

// 스위치 스타일링
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

export default function MyEditor() {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const uploadImageCallBack = async (file) => {
    try {
      const url = await uploadImage(file);
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'image', 'IMMUTABLE', { src: url }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState, entityKey, ' '
      );
      const forcedEditorState = EditorState.forceSelection(
        newEditorState,
        newEditorState.getCurrentContent().getSelectionAfter()
      );
      setEditorState(forcedEditorState);
      return { data: { link: url } };
    } catch (error) {
      console.error('Image upload failed:', error);
      return { error: 'Image upload failed' };
    }
  };

  const myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: Media,
        editable: false,
      };
    }
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContentState);
    console.log('Editor content in HTML format:', htmlContent);
    // 여기서 서버로 전송하거나 로컬 저장소에 저장할 수 있습니다.
  };


  ////////////////////////////////
  const uid = parseInt(GetWithExpiry("uid"));

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
    console.log(selectedFiles);
    setImages(images.concat(selectedFiles)); // 기존 이미지 배열에 추가

    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previewUrls.concat(newPreviewUrls)); // 미리보기 URL 배열에 추가
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

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
    <div className="editor-container">
      <div className="editor-header">
        {/* 공개/비공개 설정 */}
        <Button component="label">
          <Typography sx={{ marginRight: '0.5em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>비공개</Typography>
          <AntSwitch sx={{ marginBottom: '0.3em' }} defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
          <Typography sx={{ marginLeft: '0.5em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>공개</Typography>
        </Button>
        {/* 카카오 맵 API 지도 생성 */}
        <Button style={{ marginBottom: '0.1rem' }}>
          <Icon style={{ color: 'black', fontSize: 'large' }}>add_location_alt</Icon>
          <Typography fontSize='small' sx={{ color: 'gray', marginRight: '1rem' }}>위치 추가
          </Typography>
        </Button>
        <Button sx={{ color: 'lightcoral', marginLeft: '1em', marginBottom: '1rem', marginTop: '0.5rem' }} variant="contained" color="info" onClick={handleSave}>
          작성 완료
        </Button>
      </div >
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        blockRendererFn={myBlockRenderer}
        toolbar={{
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: true },
            urlEnabled: false,
          },
        }}
        editorClassName='editor'
        localization={{
          locale: 'ko',
        }}
      />
    </div >
  );
}
