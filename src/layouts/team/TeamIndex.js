import React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Box, Typography, Card, CardContent, Avatar, Grid } from "@mui/material";
import { styled } from '@mui/material/styles';


const teamMembers = [
  {
    name: "이병학",
    role: "BE 설계 및 구현",
    avatar: "/images/teamimage/beonghak.png", // 실제 이미지 URL로 교체
    description: "백엔드 전체적인 개발을 책임 및 담당"
  },
  {
    name: "곽주영",
    role: "FE 설계 및 구현",
    avatar: "/images/teamimage/juyong.png", // 실제 이미지 URL로 교체
    description: "프론트엔드 개발 및 최적화를 담당"
  },
  {
    name: "정성한",
    role: "FE 구현 및 디자인",
    avatar: "/images/teamimage/sunghan.png", // 실제 이미지 URL로 교체
    description: "프론트엔드 개발과 친화적인 UI/UX를 담당"
  },
  {
    name: "안순현",
    role: "FE/BE 설계 및 구현",
    avatar: "/images/teamimage/soonhyun.png", // 실제 이미지 URL로 교체
    description: "프론트 / 백엔드의 전반적인 개발 담당."
  },

  {
    name: "윤영준",
    role: "DB 설계",
    avatar: "/images/teamimage/yongjun.png", // 실제 이미지 URL로 교체
    description: "데이터베이스 설계 및 관리를 담당."
  },

  {
    name: "이윤주",
    role: "기획",
    avatar: "/images/teamimage/yunju.png", // 실제 이미지 URL로 교체
    description: "프로젝트 기획 및 관리를 담당"
  }
];


const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const HoverableImage = styled('img')({
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(0.9)'
  }
});

const Team = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          OUR TEAM
        </Typography>
        <Box display="flex" justifyContent="center" mb={3} mt={-5}>
          <HoverableImage
            src='/images/teamimage/DarkLogo.png'
            style={{ maxWidth: '25vw', maxHeight: '25vh' }}
          />
        </Box>

        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          팀원 소개
        </Typography>
        <Grid container spacing={3}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      alt={member.name}
                      src={member.avatar}
                      sx={{
                        width: 100,
                        height: 100,
                        marginBottom: 2,
                        margin: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #FFC0CB' // 연한 분홍색 테두리
                      }}
                    />
                    <Typography style={{ marginTop: '12px' }} variant="h6" sx={{ fontWeight: 'bold' }}>{member.name}</Typography>
                    <Typography variant="h5" color="textSecondary">{member.role}</Typography>
                    <Typography fontSize="12px" textAlign="center" mt={1} sx={{ color: '#757575' }}>
                      {member.description}
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default Team;
