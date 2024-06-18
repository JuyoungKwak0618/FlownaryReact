// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import ShowAlbumList from "./components/showAlbumList";
import { Box, Card, CardMedia, Divider, Icon } from "@mui/material";
import { Bar } from "react-chartjs-2";
import UserLoginService from "ut/userLogin-Service";
import { useContext } from "react";
import { UserContext } from "api/LocalStorage";
import { useNavigate } from "react-router-dom";

function album() {
  const navigate = useNavigate();
  const { activeUser } = useContext(UserContext);
  const goLogin = () => navigate('/authentication/sign-in');

  if (activeUser.uid === undefined || activeUser.uid < 0) {
    return <UserLoginService goLogin={goLogin} />;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ShowAlbumList />
      <Footer />
    </DashboardLayout >
  );
}

export default album;
