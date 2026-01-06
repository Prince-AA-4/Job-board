import { Box } from "@mui/material";

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '120vh',
        zIndex: -1,
        overflow: 'hidden',
        backgroundImage: 'url(/carousel/Carousel2.jpg)', 
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
      }}
    />
  );
};

export default HeroSection;
