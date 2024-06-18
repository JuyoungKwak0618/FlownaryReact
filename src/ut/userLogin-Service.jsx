import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Box, Icon, CardContent, Typography } from '@mui/material';

const UserLoginService = ({ goLogin }) => {
  return (
    <Grid container justifyContent="center" alignItems="center"
      style={{ marginLeft: '15.75rem', height: "100vh", width: '80vw' }}>
      <Grid item >
        <Card
          onClick={goLogin}
          sx={{
            padding: '40px',
            maxWidth: '600px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 6,
              '& .hover-text': {
                color: 'primary.dark'
              }
            }
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
            <Icon fontSize="large" style={{ fontSize: '80px' }}>lock</Icon>
          </Box>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              className="hover-text"
              sx={{
                transition: 'color 0.3s',
              }}
            >
              로그인이 필요한 서비스 입니다
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

UserLoginService.propTypes = {
  goLogin: PropTypes.func.isRequired,
};

export default UserLoginService;
