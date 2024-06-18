import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Box, Button, Dialog, IconButton, Modal, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFamilyUserList } from 'api/axiosGet';
import Iconify from 'components/iconify/iconify';
import { updateFamily } from 'api/axiosPost';
import { UserContext } from "api/LocalStorage";
import { getFamily } from "api/axiosGet";
import { deleteFamily } from "api/axiosPost";
import { isEmpty } from "api/emptyCheck";
import { familyUserConfirm } from "api/alert";
import { statusFamilyUser } from "api/axiosPost";
import Loading from "api/loading";
import CloseIcon from '@mui/icons-material/Close';
import { correct } from "api/alert";

function FamilyUserList(props) {

  const { activeUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const faid = props.faid;
  const [fam, setFam] = useState(null);
  const [famname, setFamname] = useState('');

  // faid로 getFamily 불러와서 패밀리네임 가져오기
  useEffect(() => {
    console.log(faid);
    if (faid !== -1) {
      const fetchfam = async () => {
        const famtemp = await getFamily(faid);
        if (!isEmpty(famtemp)) {
          setFam(famtemp);
          setFamname(famtemp.name);
        }
      }
  
      fetchfam();
    }
  }, [faid]);
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'profile', headerName: '프로필', width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: 1 }}>
          {params.value ? <Avatar src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${params.value}`} /> : <Avatar src="" />}
        </Box>
      ),
    },
    {
      field: 'name', headerName: '이름', width: 100,
      renderCell: (params) => (
        <Box>
          {params.row.status === 2 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify style={{ marginRight: '3px' }} icon="openmoji:crown" /> {/* Status가 2일 때만 왕관 아이콘을 표시 */}
              {params.value}
            </Box>
          )}
          {params.row.status === 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify style={{ marginRight: '3px' }} icon="pepicons-print:person-circle-filled" /> {/* Status가 2일 때만 왕관 아이콘을 표시 */}
              {params.value}
            </Box>
          )}
        </Box>
      ),
    },

    {
      field: 'status', headerName: '구성원', width: 100,
      renderCell: (params) => (
        <Box>
          {params.value === 2 && '패밀리장'}
          {params.value === 1 && '관리자'}
          {params.value === 0 && '소속원'}
        </Box>
      )
    },
    {
      field: 'regTime',
      headerName: '가입시간',
      width: 200,
      renderCell: (params) => (
        <Box>
          {`${new Date(params.value).getFullYear()}.${(new Date(params.value).getMonth() + 1).toString().padStart(2, '0')}.${new Date(params.value).getDate().toString().padStart(2, '0')} 오후 ${(new Date(params.value).getHours() % 12).toString().padStart(2, '0')}:${new Date(params.value).getMinutes().toString().padStart(2, '0')}`}
        </Box>
      )
    },
    {
      field: 'action',
      headerName: '행동',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {fam && activeUser.uid === fam.leaderuid && activeUser.uid !== params.row.uid && (
            <Button variant="contained" color="success" onClick={() => handleBanUser(params.row.uid, params.row.faid)}>
              내보내기
            </Button>
          )}
        </Box>
      ),
    },
  ];
  
  const handleBanUser = async (uid, faid) => {
    const result = await familyUserConfirm("정말로 내보내시겠습니까?", famname);

    if (result === 1) {
      statusFamilyUser(faid, uid, -1);
      queryClient.invalidateQueries('familyuserlist');
    }
  };

  // 모달창
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 패밀리 수정
  const handleFamilyUpdate = (name, faid) => {
    if (faid !== -1) {
      updateFamily(faid, name);
      correct('수정 완료');
      queryClient.invalidateQueries('familylist');
    }
  }

  const handleDeleteButton = async (faid) => {
    const verify = await deleteConfirm();
    if(verify === 1) {
      deleteFamily(faid);
    }
    queryClient.invalidateQueries('familylist');
  }



  const { data: familyUserList, isLoading, isError } = useQuery({
    queryKey: ['familyuserlist', faid],
    queryFn: () => getFamilyUserList(faid),
  })

  if (faid === -1) {
    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <Box>
          데이터가 없습니다
        </Box>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <Box>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '85vh',
          }}> <Loading />
          </div>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <Box sx={{display:'flex',justifyContent:'center'}}>
          <Typography sx={{color: 'lightcoral'}}>{famname}</Typography>
        </Box>
        <Box>
          <DataGrid
            rows={familyUserList}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </Box>

        {fam && activeUser.uid == fam.leaderuid && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mr: 3 }}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<Iconify icon="mdi:pencil-outline" />}
              onClick={handleOpen}
              sx={{
                color: 'CornflowerBlue',
                borderColor: 'CornflowerBlue',
                padding: '8px 16px',
                marginRight: 2,
                fontSize: '16px',
                fontWeight: 'bold',
              }}>
              수정 하기
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleDeleteButton(faid)}
              startIcon={<Iconify icon="mdi:trash-can-outline" />}
              sx={{
                borderColor: 'red',
                '&:hover': {
                  bgcolor: 'darkred',
                },
                color: '#f55c45',
                padding: '8px 16px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              삭제
            </Button>
          </Box>
        )
        }
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
           <IconButton aria-label="close" onClick={handleClose}
          sx={{
            position: 'absolute', right: 8, top: 6,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <CloseIcon />
        </IconButton>
          <Typography id="modaltitle" fontWeight={'bold'} sx={{ color: 'lightslategray' }}>
            패밀리 수정
          </Typography>
          <TextField label="패밀리 이름" variant="outlined"
            value={famname}
            onChange={(e) => setFamname(e.target.value)}
            sx={{
              color: 'lightcoral',
              marginTop: '10px',
              '& .MuiInputLabel-outlined': {
                fontSize: '1rem',
                lineHeight: '1.3',
                color: 'lightcoral',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'lightcoral', // 기본 outline 색상 변경
                },
                '&:hover fieldset': {
                  borderColor: 'lightcoral', // 호버 상태에서 outline 색상 변경
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'lightcoral',
                  color: 'lightcoral', // 포커스 상태에서 outline 색상 변경
                },
                padding: '3px 3px', // 입력 필드의 패딩 조정
              }
            }}
          /> <br />
          <Button variant="outlined" onClick={() => handleFamilyUpdate(famname, faid)} sx={{ marginTop: '10px', color: 'lightcoral', borderColor: 'lightcoral', }}>수정</Button>

        </Box>
      </Modal>
    </>
  );
}

FamilyUserList.propTypes = {
  faid: PropTypes.number,
}

export default FamilyUserList;