import { Box, Typography } from '@mui/material';

function Bot() {
  return (
    <Box sx={main}>
      <Box sx={tableMain}>
        <Typography sx={{ marginBottom: '16px' }} variant='h6'>
          Will be ready
        </Typography>
      </Box>
    </Box>
  );
}

const tableMain: any = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '80vw',
  borderRadius: '15px 15px 0 0',
  backgroundColor: 'white',
  paddingTop: '24px',
};

const main = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#222831',
};

export default Bot;
