import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

// mui 라이브러리
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { Button, TextField } from '@mui/material';

// api 폴더
import { getUserList, getUser } from 'api/axiosGet';
import { updateUserStatus } from 'api/axiosPost';

// examples, components 등등 작업 폴더
import Iconify from '../../../components/iconify';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Loading from 'api/loading';
import UserAvatar from 'api/userAvatar';

// ----------------------------------------------------------------------

Modal.setAppElement('#app'); // Modal 접근성을 위한 설정

export default function UserTableRow({ selected, handleClick }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const rowsPerPage = 10;

  // 유저 정보 변경
  const handleUpdateStatus = (userId, newStatus) => {
    mutate({ uid: userId, status: newStatus, });
  };

  const handleStatusChange = (userId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    Swal.fire({
      text: `${currentStatus === 0 ? "비활성화" : "활성화"}를 진행합니다.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네",
      cancelButtonText: "아니오"
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(userId, newStatus);
        Swal.fire({
          title: "비활성화 되었습니다!",
        });
      }
    });
  };

  // 유저 정보 수정
  const handleUserProfileEdit = (userId) => {
    const user = users.find((user) => user.uid === userId);
    setModalUser(user);
    setIsModalOpen(true);
  };



  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalUser(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleShowInactive = () => {
    setShowInactive(!showInactive);
  };

  // location을 이용한 사용자 정보 가져오기
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const uid = searchParams.get('uid');
    if (uid) {
      // API를 통해 해당 uid의 사용자 정보 가져오기
      getUser(uid).then((data) => {
        setModalUser(data);
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      });
    }
  }, [location]);

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUserList,
    onSuccess: (data) => {

      setUserData(data);
    }
  });

  const { mutate } = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      Swal.fire('유저 정보를 업데이트했습니다', '', 'success');
      queryClient.invalidateQueries(['users']);
    },
    onError: () => {
      Swal.fire('유저 정보 업데이트에 실패했습니다.', '', 'error');
    },
  });

  if (isLoading) {
    return <div><Loading /></div>;
  }

  if (isError) {
    return (
      <TableRow>
        <TableCell>유저 정보를 불러오는데 실패 했습니다.</TableCell>
      </TableRow>
    );
  }

  const filteredUsers = showInactive
    ? users.filter((user) => user.status === 1)
    : users.filter((user) => user.status === 0);

  // console.log('Filtered users:', filteredUsers); // 필터링 후 데이터 확인용 로그 추가

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Container sx={{ padding: '1rem' }}>
          <Typography variant="h4">유저 목록</Typography>
          <Typography variant="body2" onClick={handleShowInactive} sx={{ cursor: 'pointer', color: 'rgb(24, 94, 224)', }}>
            {showInactive ? '' : '비'} 활성화 유저 목록 페이지
          </Typography>
          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
            sx={{ ml: 85, mb: 2, }}
          />
          <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
            <TableContainer component={Paper} mt={3}>
              <Table size='small'>
                <TableBody>
                  {paginatedUsers && paginatedUsers.map((user, idx) => (
                    <TableRow
                      key={idx}
                      hover
                      tabIndex={-1}
                      role="checkbox"
                      selected={selected}
                      sx={{ backgroundColor: 'inherit' }}
                    >
                      <TableCell size="small" component="th" scope="row" padding="none" align="center">
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                          {user.profile &&
                            <Avatar sx={{ width: '2rem', height: '2rem' }}>
                              <UserAvatar profileUrl={user.profile} />
                            </Avatar>}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" noWrap>
                          {user.uname ? user.uname : "확인이 필요한 유저"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {user.provider === 'google' ? '구글가입' : 'Flow가입'}
                      </TableCell>
                      <TableCell align="center">
                        {user.role === 1 ? 'Admin' : 'User'}
                      </TableCell>
                      <TableCell align="center">
                        {user.regDate}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleUserProfileEdit(user.uid)}>
                          <Iconify icon="eva:person-fill" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          sx={{
                            color: 'white',
                            backgroundColor: user.status === 0 ? 'rgba(0, 255, 0, 0.25)' : 'rgba(255, 0, 0, 0.25)',
                            '&:hover': {
                              backgroundColor: user.status === 0 ? 'rgba(0, 255, 0, 0.35)' : 'rgba(255, 0, 0, 0.35)',
                            },
                          }}
                          onClick={() => handleStatusChange(user.uid, user.status)}
                        >
                          {user.status === 0 ? '비활성화' : '활성화'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </Stack>
        </Container>
      </DashboardLayout>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="User Profile Edit"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        {modalUser && (
          <div>
            <h2>{modalUser.uname} 프로필 정보</h2>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.uid}
                margin="normal"
                label="UID"
                InputProps={{
                  readOnly: true,
                }}
                disabled
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.uname ? modalUser.uname : "미기재"}
                margin="normal"
                label="이름"
                disabled
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.gender === 0 ? "남성" : "여성"}
                margin="normal"
                label="성별"
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.tel}
                margin="normal"
                label="전화번호"
                disabled
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.brith ? modalUser.brith : "미기재"}
                margin="normal"
                label="생년월일"
                disabled
                sx={{ width: '300px' }}
              />
            </div>
            <Button onClick={handleModalClose}>닫기</Button>
          </div>
        )}
      </Modal>
    </>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
