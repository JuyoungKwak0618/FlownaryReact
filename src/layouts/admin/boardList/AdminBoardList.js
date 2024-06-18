import React, { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useQuery } from "@tanstack/react-query";
import { getDeclarationList, getBoardList } from "api/axiosGet";
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { Dialog, Icon } from "@mui/material";
import BoardDetail from "layouts/home/Board/BoardDetail";
import { useAddLike } from "api/customHook";
import { wrong } from "api/alert";

const CustomTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: '#E3F2FD',
    borderRadius: '8px',
    color: theme.palette.primary.main,
  },
  textTransform: 'none',
  fontWeight: 'bold',
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  '& .MuiDataGrid-cell': {
    borderBottom: 'none',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.grey[200],
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

export default function AdminBoardList({ selected, handleClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState('one');
  const [open, setOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [index, setIndex] = useState(0);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = (bid) => {
    setSelectedBid(bid);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBid(null);
  };

  const { data: boards } = useQuery({
    queryKey: ['boards'],
    queryFn: () => getBoardList(0, 'title', '', '', searchTerm, 1, -1),
  });

  const { data: declaration } = useQuery({
    queryKey: ['boards2'],
    queryFn: () => getDeclarationList(),
  });

  const filteredBoards = searchTerm
    ? boards?.filter(board =>
      `${board.bid}번`.toString().includes(searchTerm.toLowerCase()) ||
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : boards || [];


  const filteredDeclaration = searchTerm
    ? declaration?.filter(decl =>
      `${decl.deid}번`.toString().includes(searchTerm.toLowerCase()) ||
      decl.dTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${decl.uid}번`.toString().includes(searchTerm.toLowerCase())
    )
    : declaration || [];

  const formatDate = (dateString) => {
    return dateString.replace('T', ' ');
  };

  const rowsDeclaration = filteredDeclaration?.map((data, index) => ({
    id: index,
    bid: data.bid ? data.bid : null,
    uid: data.uid,
    dTitle: data.dTitle,
    dContents: data.dContents,
    modTime: formatDate(data.modTime),
    state: data.state,
  }));

  const columnsDeclaration = [
    { field: 'uid', headerName: 'UID', flex: 1 },
    { field: 'dTitle', headerName: '제목', flex: 1 },
    { field: 'dContents', headerName: '내용', flex: 1 },
    { field: 'modTime', headerName: '등록 일자', flex: 1 },
    { field: 'state', headerName: '처리 상태', flex: 1 },
  ];

  const rowsBoards = filteredBoards?.map((data, indexs) => ({
    id: indexs,
    bid: data.bid,
    uid: data.uid,
    nickname: data.nickname,
    title: data.title,
    bContents: data.bContents,
    modTime: formatDate(data.modTime),
  }));

  const columnsBoards = [
    { field: 'uid', headerName: 'UID', flex: 1 },
    { field: 'nickname', headerName: '닉네임', flex: 1 },
    { field: 'title', headerName: '제목', flex: 2 },
    { field: 'bContents', headerName: '내용', flex: 3 },
    { field: 'modTime', headerName: '등록 일자', flex: 3 },
  ];

  const addLike = useAddLike();
  const addLikeForm = async (sendData) => {
    await addLike(sendData);
  }


  // 좋아요 버튼 누를 때 넘기기
  function handleButtonLike(bid, uid2) {
    if (uid === -1) {
      wrong("로그인이 필요한 서비스입니다.");
      return;
    }


    const sendData = {
      uid: uid,
      fuid: uid2,
      oid: bid,
      type: 1,
    }


    addLikeForm(sendData);
  }
  // 댓글 좋아요 버튼 누를 때 넘기기
  function handleButtonLikeReply(rid, uid2) {
    if (uid === -1) {
      wrong("로그인이 필요한 서비스입니다.");
      return;
    }

    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: rid,
      type: 2,
    }


    addLikeForm(sendData);
  }
  // 대댓글 좋아요 버튼 누를 때 넘기기
  function handleButtonLikeReReply(rrid, uid2) {
    if (uid === -1) {
      wrong("로그인이 필요한 서비스입니다.");
      return;
    }


    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: rrid,
      type: 3,
    }


    addLikeForm(sendData);
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ width: '100%', p: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                sx={{ flex: 1, mr: 2 }}
                label="검색"
                variant="outlined"
                onChange={handleSearch}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            <CustomTabs
              value={value}
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
              aria-label="게시물 관리 탭"
              centered
            >
              <CustomTab value="one" label="신고글 목록" />
              <CustomTab value="two" label="게시글 목록" />
            </CustomTabs>
            <Divider sx={{ my: 2 }} />
            <Typography component="div" sx={{ mt: 2 }}>
              {value === 'one' ? (
                <Box sx={{ height: 450 }}>
                  <StyledDataGrid
                    rows={rowsDeclaration}
                    columns={columnsDeclaration}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                      sorting: {
                        sortModel: [{ field: 'uid', sort: 'asc' }],
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowClick={(params) => handleOpen(params.row.bid)}
                  />
                </Box>
              ) : (
                <Box sx={{ height: 450 }}>
                  <StyledDataGrid
                    rows={rowsBoards}
                    columns={columnsBoards}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                      sorting: {
                        sortModel: [{ field: 'uid', sort: 'asc' }],
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowClick={(params) => handleOpen(params.row.bid)}
                  />
                </Box>
              )}
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
      {/* 게시글 모달 */}
      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '90%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
            zIndex: 0
          },
        }}
      >
        <IconButton aria-label="close" onClick={handleClose}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <Icon>close</Icon>
        </IconButton>
        {selectedBid && (
          <BoardDetail bid={selectedBid} handleClose={handleClose} uid={99999} index={index} nickname={'admin'} handleButtonLikeReply={handleButtonLikeReply} handleButtonLikeReReply={handleButtonLikeReReply} handleButtonLike={handleButtonLike} />
        )}
      </Dialog>
    </DashboardLayout>
  );
}

AdminBoardList.propTypes = {
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
