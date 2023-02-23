import { createTheme, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import App from './App';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#30475E',
    },
    secondary: {
      main: '#F05454',
    },
  },
});

const app = (
  <ThemeProvider theme={darkTheme}>
    <App />
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(app);
