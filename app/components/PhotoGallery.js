"use client";

import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import {NextResponse} from "next/server";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function PhotoGallery(props) {
  const images = props.images;
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  console.log(images);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box 
        sx={{ 
            maxWidth: 1,
            flexGrow: 0, }}
    >
        <Paper
            square
            elevation={0}
            sx={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                height: 50,
                pl: 2,
                bgcolor: 'background.default',
            }}
        >
            <Typography 
                style={{color: "#000"}}
                sx={{display: 'flex'}}
                variant="h5"
            >
                {images[activeStep].props.title}
            </Typography>
        </Paper>

        <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
            
                <Button
                    size="large"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                >
                    Next
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                    ) : (
                        <KeyboardArrowRight />
                    )}
                </Button>
            }
            backButton={
                <Button size="large" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowRight />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                        Back
                </Button>
            }
        />

        <AutoPlaySwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            style={{backgroundColor: "#fff"}}
        >
            {images.map((step, index) => (
                <Box key={index} 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        maxWidth: 1,
                        maxHeight: 1
                    }}
                >
                    {Math.abs(activeStep - index) <= 2 ? (step) : null}
                </Box>

            ))}
        </AutoPlaySwipeableViews>


    </Box>
  );
}

export default PhotoGallery;




