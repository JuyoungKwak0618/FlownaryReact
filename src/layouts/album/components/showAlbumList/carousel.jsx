import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import PropTypes from 'prop-types';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews); // 자동 카로셀 하고 싶으면 하기

export default function SwipeableTextMobileStepper({ images = [] }) {  // Destructure the prop and provide a default value
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState('auto');
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleImageLoad = (event) => {
    const { height } = event.target;
    setContainerHeight(height);
  };

  return (
    <Box
      sx={{
        width: '60%',
        margin: '0 auto', // Center the component horizontally
      }}
    >
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images && images.length > 0 ? (
          images.map((step, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
              height: containerHeight,
            }}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: '100%',
                    overflow: 'hidden',
                    width: '100%',
                    objectFit: 'contain',
                  }}
                  src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${step}`}
                  alt={`Slide ${index}`}
                  onLoad={handleImageLoad}
                />
              ) : null}
            </div>
          ))
        ) : (
          <Typography variant="h6" component="div" sx={{ p: 2 }}>
            No images available
          </Typography>
        )}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ backgroundColor: 'rgb(255, 255, 255, 0)', mt: 5 }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            sx={{ backgroundColor: 'rgb(255, 255, 255, 0.5)' }}
          >
            다음
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0} sx={{ backgroundColor: 'rgb(255, 255, 255, 0.5)' }}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            이전
          </Button>
        }
      />
    </Box>
  );
}

SwipeableTextMobileStepper.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};
