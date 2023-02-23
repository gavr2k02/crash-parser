import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { api } from './services';
import { times } from 'lodash';

const URL =
  'wss://crash.get-x.site/socket.io/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5nZXQteC5zaXRlL2F1dGgvcmVnaXN0ZXIvb25lX2NsaWNrIiwiaWF0IjoxNjc2OTY0NTgzLCJleHAiOjE2NzczOTY1ODMsIm5iZiI6MTY3Njk2NDU4MywianRpIjoieFBTZ0JiWUtaSFhyR1JlbSIsInN1YiI6OTQ0ODkwLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwiaWQiOjk0NDg5MCwicm9sZSI6InVzZXIiLCJuYW1lIjoiTWljaGVsbGUgQW5kZXJzb24iLCJoYXNoIjoiYWNlYmM4MmEwNjAzMGZmYzY5NzdkNTI1YmYyZTQwYTcxMDZhNzIzZSIsInBob3RvX3NtIjoiaHR0cHM6Ly9nZXR4LWF2YXRhcnMuczMuZXUtY2VudHJhbC0wMDMuYmFja2JsYXplYjIuY29tL2F2YXRhci5zdmciLCJwaG90b19tZCI6Imh0dHBzOi8vZ2V0eC1hdmF0YXJzLnMzLmV1LWNlbnRyYWwtMDAzLmJhY2tibGF6ZWIyLmNvbS9hdmF0YXIuc3ZnIiwicGhvdG9fbGciOiJodHRwczovL2dldHgtYXZhdGFycy5zMy5ldS1jZW50cmFsLTAwMy5iYWNrYmxhemViMi5jb20vYXZhdGFyLnN2ZyJ9.AEKI8wcqXzOBlvTwzx8nBFz8Zs7beF6Y6rQTQxT3kRA&EIO=4&transport=websocket';

function App() {
  const [started, setStarted] = useState(false);
  const [url, setUrl] = useState<string>();

  const [totalBet, setTotalBet] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [stage, setStage] = useState('STAGE');

  const [sessionBet, setSessionBet] = useState(0);
  const [sessionWon, setSessionWon] = useState(0);
  const [countUsers, setCountUsers] = useState(0);

  const [gamesCount, setGamesCount] = useState(0);

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    started && api.init(url || URL);
  }, [started]);

  useEffect(() => api.totalBet.subscribe(setTotalBet));
  useEffect(() => api.totalWon.subscribe(setTotalWon));

  useEffect(() => api.sessionBet.subscribe(setSessionBet));
  useEffect(() => api.sessionWon.subscribe(setSessionWon));
  useEffect(() => api.usersSessionCount.subscribe(setCountUsers));
  useEffect(() => api.gamesCount.subscribe(setGamesCount));
  useEffect(() => api.gameStage.subscribe(setStage));

  const isMobile = window.innerWidth <= 460;

  useEffect(
    () => api.prevSession.subscribe((value) => setSessions((prev) => [value, ...prev.slice(0, 9)])),
    [sessions],
  );

  return (
    <Box style={main}>
      {!started ? (
        <Box style={startBox}>
          <TextField label='URL' value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button style={startButton} variant='contained' onClick={() => setStarted(true)}>
            START
          </Button>
        </Box>
      ) : (
        <Box style={tableMain}>
          <Box sx={headerBox}>
            <Box sx={stageBox}>
              <Typography sx={{ fontWeight: 'bold' }}>{stage}</Typography>
            </Box>
            <Box style={tableHeader}>
              <Box style={stylesBoxTotal}>
                <Typography>{isMobile ? 'GC' : 'GAMES COUNT:'}</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{gamesCount}</Typography>
              </Box>

              {!isMobile && (
                <Box style={stylesBoxTotal}>
                  <Typography>{isMobile ? 'TT:' : 'TOTAL TURNOVER:'}</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{getNumber(totalBet)}</Typography>
                </Box>
              )}

              {!isMobile && (
                <Box style={stylesBoxTotal}>
                  <Typography>{isMobile ? 'TR:' : 'TOTAL RETURNED:'}</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{getNumber(totalWon)}</Typography>
                </Box>
              )}

              <Box style={stylesBoxTotal}>
                <Typography>TOTAL LOST:</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{getNumber(totalBet - totalWon)}</Typography>
              </Box>

              <Box style={stylesBoxTotal}>
                <Typography>{isMobile ? 'PERC:' : 'PERCENTAGE:'}</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{((totalWon / totalBet || 0) * 100).toFixed(1)}%</Typography>
              </Box>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='right'>{isMobile ? 'Us' : 'USERS'}</TableCell>
                  <TableCell align='right'>{isMobile ? 'Tu' : 'TURNOVER'}</TableCell>
                  <TableCell align='right'>{isMobile ? 'Re' : 'RETURNED'}</TableCell>
                  <TableCell align='right'>{isMobile ? 'Lo' : 'LOST'}</TableCell>
                  <TableCell align='right'>{isMobile ? 'Pe' : 'PERCENTAGE'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ backgroundColor: '#EADDCA' }}>
                  <TableCell align='right'>{countUsers}</TableCell>
                  <TableCell align='right'>{getNumber(sessionBet)}</TableCell>
                  <TableCell align='right'>{getNumber(sessionWon)}</TableCell>
                  <TableCell align='right' style={{ color: sessionBet - sessionWon >= 0 ? '#F05454' : 'green' }}>
                    {getNumber(sessionBet - sessionWon)}
                  </TableCell>
                  <TableCell align='right'>{((sessionWon / sessionBet) * 100 || 0).toFixed(1)}%</TableCell>
                </TableRow>
                {times(10).map((idx) => (
                  <TableRow key={idx}>
                    <TableCell align='right'>{sessions[idx]?.count || 0}</TableCell>
                    <TableCell align='right'>{getNumber(sessions[idx]?.bet)}</TableCell>
                    <TableCell align='right'>{getNumber(sessions[idx]?.won)}</TableCell>
                    <TableCell
                      align='right'
                      style={{ color: sessions[idx]?.bet - sessions[idx]?.won >= 0 ? '#F05454' : 'green' }}
                    >
                      {getNumber(sessions[idx]?.bet - sessions[idx]?.won)}
                    </TableCell>
                    <TableCell align='right'>
                      {((sessions[idx]?.won / sessions[idx]?.bet) * 100 || 0).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}

const headerBox = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',

  width: '100%',
  paddingTop: '12px',
  paddingBottom: '12px',
};

const stageBox = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',

  padding: '0 15px',
};

const tableHeader: any = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexGrow: 1,
};

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

const main = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#222831',
};

const stylesBoxTotal: any = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
};

const getNumber = (value: number) => {
  return (typeof value !== 'number' || Number.isNaN(value) ? 0 : value).toLocaleString();
};

export default App;
