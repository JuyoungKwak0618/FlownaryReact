import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { CardMedia, Grid, Modal, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import YearSelect from '../yearSelect';
import { getMyBoardList } from "api/axiosGet";
import { GetWithExpiry } from "api/LocalStorage";
import Carousels from "./carousel";
import Loading from "api/loading";
import './album.css';
import { border } from '@cloudinary/url-gen/qualifiers/background';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function ShowAlbumList() {
  const uid = parseInt(GetWithExpiry('uid'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [open, setOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (images, index) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentImages([]);
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + currentImages.length) % currentImages.length);
  };

  const { data: board, isLoading, error } = useQuery({
    queryKey: ['board', uid],
    queryFn: () => getMyBoardList(uid),
  });

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '65vh'
      }}> <Loading />
      </div>
    );
  }
  if (error) return <div>Error loading data</div>;

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <MDBox>
      <MDBox>
        <YearSelect selectedYear={selectedYear} onChange={handleYearChange} />
        <Grid container mt={3} spacing={0.5} sx={{ border: '1px solid white' }}>
          {selectedYear > 2022 ? (
            Array.isArray(board) && board.map((data, idx) => {
              const modTime = data.modTime;
              if (!modTime) return null;
              const yearFromModTime = new Date(modTime).getFullYear();
              if (yearFromModTime !== selectedYear) return null;

              const images = data.image ? (data.image.includes(',') ? data.image.split(',').map(img => img.trim()) : [data.image.trim()]) : null;

              return (
                <Grid item key={idx} xs={12} md={6} lg={3}>
                  {images && (
                    <MDBox>
                      <MDBox sx={{ width: '100%', height: '100%' }}>
                        <MDBox
                          onClick={() => handleOpen(images, 0)}
                          variant="gradient"
                          borderRadius="lg"
                          sx={{
                            height: "15rem",
                            transition: 'box-shadow 0.3s',
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            '&:hover': {
                              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                            }
                          }}
                        >
                          <CardMedia
                            className="albumCardList"
                            component="img"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              p: 0,
                              m: 0,
                            }}
                            image={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${images[0]}`}
                            alt="Main Image"
                          />
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  )}
                </Grid>
              );
            })
          ) : (
            Array.isArray(board) && board.map((data, idx) => {
              const images = data.image.includes(',') ? data.image.split(',').map(img => img.trim()) : [data.image.trim()];

              return (
                <Grid item key={idx} xs={12} md={6} lg={3}>
                  <MDBox>
                    <MDBox sx={{ width: '100%', height: '100%' }}>
                      <MDBox
                        onClick={() => handleOpen(images, 0)}
                        variant="gradient"
                        borderRadius="lg"
                        sx={{
                          height: "15rem",
                          transition: 'box-shadow 0.3s',
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          '&:hover': {
                            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                          }
                        }}
                      >
                        <CardMedia
                          className="albumCardList"
                          component="img"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            p: 0,
                            m: 0,
                          }}
                          image={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${images[0]}`}
                          alt="Main Image"
                        />
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Grid>
              );
            })
          )}

          <Modal open={open} onClose={handleClose}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '80vw',
                maxHeight: '80vh',
                backgroundColor: 'white',
                boxShadow: 24,
                p: 4,
              }}>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
                onClick={handlePrevImage}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <IconButton
                sx={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
                onClick={handleNextImage}
              >
                <NavigateNextIcon />
              </IconButton>

              <CardMedia
                component="img"
                sx={{
                  width: '80vw',
                  height: '80vh',
                  objectFit: 'contain',
                  p: 0,
                  m: 0,
                }}
                image={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImages[currentIndex]}`}
                alt="Enlarged Image"
              />
            </div>
          </Modal>

        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default ShowAlbumList;
