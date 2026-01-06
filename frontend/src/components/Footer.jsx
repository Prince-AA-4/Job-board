import { Box, Typography, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: '#f5f5f5',
      py: 4,
      mt: 8,
      textAlign: 'center',
      borderTop: '1px solid #ddd',
    }}
  >
    <Typography variant="body1" gutterBottom>
      &copy; {new Date().getFullYear()} Style & Spice. All rights reserved.
    </Typography>

    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
      <IconButton component="a" href="https://instagram.com" target="_blank" rel="noopener">
        <InstagramIcon />
      </IconButton>
      <IconButton component="a" href="https://facebook.com" target="_blank" rel="noopener">
        <FacebookIcon />
      </IconButton>
      <IconButton component="a" href="https://wa.me/233245464426" target="_blank" rel="noopener">
        <WhatsAppIcon />
      </IconButton>
    </Box>

    <Typography variant="body2" color="text.secondary">
      Built with ❤️ in Kumasi, Ghana
    </Typography>
  </Box>
);

export default Footer;
