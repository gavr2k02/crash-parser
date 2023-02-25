import { Box, Button, TextField } from '@mui/material';

type Props = {
  handleStartClick: () => void;
  url: string;
  setUrl: (value: string) => void;
};

function ConfigBox({ setUrl, handleStartClick, url }: Props) {
  return (
    <Box sx={startBox}>
      <TextField label='URL' value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button sx={startButton} variant='contained' onClick={handleStartClick}>
        START
      </Button>
    </Box>
  );
}

const startButton = {
  width: '128px',
  marginTop: '1rem',
};

const startBox: any = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  height: '164px',
  width: '312px',
  borderRadius: '15px',
  backgroundColor: '#DDDDDD',
};

export default ConfigBox;
