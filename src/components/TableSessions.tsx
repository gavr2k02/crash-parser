import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { times } from 'lodash';
import { api } from '../services';

function TableSessions() {
  const [totalBet, setTotalBet] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [stage, setStage] = useState('STAGE WAIT...');

  const [sessionBet, setSessionBet] = useState(0);
  const [sessionWon, setSessionWon] = useState(0);
  const [countUsers, setCountUsers] = useState(0);

  const [gamesCount, setGamesCount] = useState(0);

  const [sessions, setSessions] = useState([]);

  useEffect(() => api.totalBet.subscribe(setTotalBet));
  useEffect(() => api.totalWon.subscribe(setTotalWon));

  useEffect(() => api.sessionBet.subscribe(setSessionBet));
  useEffect(() => api.sessionWon.subscribe(setSessionWon));
  useEffect(() => api.usersSessionCount.subscribe(setCountUsers));
  useEffect(() => api.gamesCount.subscribe(setGamesCount));
  useEffect(() => api.gameStage.subscribe(setStage));

  useEffect(() => api.prevSessions.subscribe(setSessions));

  const isMobile = window.innerWidth <= 460;

  return (
    <Box sx={main}>
      <Box sx={tableMain}>
        <Box sx={headerBox}>
          <Box sx={stageBox}>
            <Typography sx={{ fontWeight: 'bold' }}>{stage}</Typography>
          </Box>
          <Box sx={tableHeader}>
            <Box sx={sxsBoxTotal}>
              <Typography>{isMobile ? 'GC' : 'GAMES COUNT:'}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{gamesCount}</Typography>
            </Box>

            {!isMobile && (
              <Box sx={sxsBoxTotal}>
                <Typography>{isMobile ? 'TT:' : 'TOTAL TURNOVER:'}</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{getNumber(totalBet)}</Typography>
              </Box>
            )}

            {!isMobile && (
              <Box sx={sxsBoxTotal}>
                <Typography>{isMobile ? 'TR:' : 'TOTAL RETURNED:'}</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{getNumber(totalWon)}</Typography>
              </Box>
            )}

            <Box sx={sxsBoxTotal}>
              <Typography>TOTAL LOST:</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{getNumber(totalBet - totalWon)}</Typography>
            </Box>

            <Box sx={sxsBoxTotal}>
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
                <TableCell align='right'>{isMobile ? 'Da' : 'DATE'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#EADDCA' }}>
                <TableCell align='right'>{countUsers}</TableCell>
                <TableCell align='right'>{getNumber(sessionBet)}</TableCell>
                <TableCell align='right'>{getNumber(sessionWon)}</TableCell>
                <TableCell align='right' sx={{ color: sessionBet - sessionWon >= 0 ? '#F05454' : 'green' }}>
                  {getNumber(sessionBet - sessionWon)}
                </TableCell>
                <TableCell align='right'>{((sessionWon / sessionBet) * 100 || 0).toFixed(1)}%</TableCell>
                <TableCell align='right'>...</TableCell>
              </TableRow>
              {times(10).map((idx) => (
                <TableRow key={idx}>
                  <TableCell align='right'>{sessions[idx]?.count || 0}</TableCell>
                  <TableCell align='right'>{getNumber(sessions[idx]?.bet)}</TableCell>
                  <TableCell align='right'>{getNumber(sessions[idx]?.won)}</TableCell>
                  <TableCell
                    align='right'
                    sx={{ color: sessions[idx]?.bet - sessions[idx]?.won >= 0 ? '#F05454' : 'green' }}
                  >
                    {getNumber(sessions[idx]?.bet - sessions[idx]?.won)}
                  </TableCell>
                  <TableCell align='right'>
                    {((sessions[idx]?.won / sessions[idx]?.bet) * 100 || 0).toFixed(1)}%
                  </TableCell>
                  <TableCell align='right'>{sessions[idx]?.date.toISOString() || '...'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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

const main = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#222831',
};

const sxsBoxTotal: any = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
};

const getNumber = (value: number) => {
  return (typeof value !== 'number' || Number.isNaN(value) ? 0 : value).toLocaleString();
};

export default TableSessions;
