import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, getYear } from 'date-fns';
import { Container, Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import AppCurrentVisits from './app-current-visits';
import AppWebsiteVisits from './app-website-visits';
import AppWidgetSummary from './app-widget-summary';
import { getBoardList, getUserList } from 'api/axiosGet';
import { GetWithExpiry } from 'api/LocalStorage';
import { WidthFull } from '@mui/icons-material';
import { getDeclarationList } from 'api/axiosGet';
import Loading from 'api/loading';
import { de } from '@faker-js/faker';

export default function Statistics() {
  const [monthlyStatistics, setMonthlyStatistics] = useState({});
  const [monthlyDeclarations, setMonthlyDeclarations] = useState({});
  const [ageGroups, setAgeGroups] = useState({});

  const { data: boards, isLoading: isBoardsLoading, error: boardsError } = useQuery({
    queryKey: ['boards'],
    queryFn: () => getBoardList(0),
  });

  const { data: users, isLoading: isUsersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUserList(),
  });

  const { data: declaration } = useQuery({
    queryKey: ['declBoards'],
    queryFn: () => getDeclarationList(),
  });

  // 유저 연도별 나이 계산
  useEffect(() => {
    if (users && Array.isArray(users)) {
      const currentYear = new Date().getFullYear();
      const ageGroups = users.reduce((acc, user) => {
        const birthYear = getYear(parseISO(user.birth));
        const age = currentYear - birthYear;

        if (age < 20) acc['8-20세'] = (acc['8-20세'] || 0) + 1;
        else if (age < 40) acc['20-40세'] = (acc['20-40세'] || 0) + 1;
        else if (age < 60) acc['40-60세'] = (acc['40-60세'] || 0) + 1;
        else if (age < 70) acc['50-70세'] = (acc['50-70세'] || 0) + 1;
        else if (age < 80) acc['60-80세'] = (acc['60-80세'] || 0) + 1;
        else acc['80세 이상'] = (acc['80세 이상'] || 0) + 1;

        return acc;
      }, {});

      setAgeGroups(ageGroups);
    }
  }, [users]);

  const disableUsers = users?.filter((user) => user.status === 1)


  // 업데이트 - 보드 게시물 연도별로 지정
  useEffect(() => {
    if (boards && Array.isArray(boards)) {
      const statistics = boards.reduce((acc, item) => {
        const date = parseISO(item.modTime);
        const month = format(date, 'yyyy-MM');
        if (!acc[month]) {
          acc[month] = {
            '게시물 업데이트': 0,
            // 다른 통계 항목을 여기에 추가할 수 있습니다.
          };
        }
        acc[month]['게시물 업데이트']++; // 통계 항목을 적절하게 업데이트합니다.
        return acc;
      }

      
      , {});
      setMonthlyStatistics(statistics);

    }
  }, [boards]);

  useEffect(() => {
    if (boards && Array.isArray(boards)) {
      const declarations = declaration.reduce((acc, item) => {
        const date = parseISO(item.modTime);
        const month = format(date, 'yyyy-MM');
        if (!acc[month]) {
          acc[month] = {
            '신고된 게시물': 0,
            // 다른 통계 항목을 여기에 추가할 수 있습니다.
          };
        }
        acc[month]['신고된 게시물']++; // 통계 항목을 적절하게 업데이트합니다.
        return acc;
      }
      
      , {});
      setMonthlyDeclarations(declarations);

    }
  }, [declaration]);


  const monthlyLabels = Object.keys(monthlyStatistics).sort();
  const monthlyLabels2 = Object.keys(monthlyDeclarations).sort();


  if (isBoardsLoading || isUsersLoading) {
    return <div><Loading /></div>;
  }

  if (boardsError || usersError) {
    return <div>Error loading data</div>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="xl">
        <Grid sx={{ mt: 3 }} container spacing={3}>
          <Grid item xs={12} sm={6} md={3} lg={2.5} sx={{ mb: 5, mr: 3 }}>
            <AppWidgetSummary
              title="공개 게시물 수"
              total={boards && boards.length > 0 ? boards.length : '0'}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.5} sx={{ mb: 5, mr: 3 }}>
            <AppWidgetSummary
              title="가입된 회원 수"
              total={users && users.length > 0 ? users.length : '0'}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.5} sx={{ mb: 5, mr: 3 }}>
            <AppWidgetSummary
              title="신고 게시물"
              total={declaration && declaration.length > 0 ? declaration.length : '0'}
              color="error"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2.5} sx={{ mb: 5, mr: 3 }}>
            <AppWidgetSummary
              title="비활성화 유저"
              total={users && disableUsers.length > 0 ? disableUsers.length : '0'}
              color="error"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8} sx={{ mb: 5 }}>
            <AppWebsiteVisits
              title="사이트 정보"
              chart={{
                labels: monthlyLabels,
                series: [
                  {
                    name: '게시물 업데이트',
                    type: 'column',
                    fill: 'solid',
                    data: monthlyLabels.map(month => monthlyStatistics[month]['게시물 업데이트']),
                  },
                  {
                    name: '신고된 게시물',
                    type: 'line',
                    fill: 'solid',
                    data: monthlyLabels2.map(month => monthlyDeclarations[month]['신고된 게시물']),
                  },
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="가입자 연령"
              chart={{
                series: Object.keys(ageGroups).map(key => ({
                  label: key,
                  value: ageGroups[key],
                })),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={7}>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </DashboardLayout>
  );
}
