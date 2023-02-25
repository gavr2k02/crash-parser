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
import { api } from '../services';

import { clone } from 'lodash';

function TableUsers() {
  const [stage, setStage] = useState('STAGE WAIT...');
  const [countUsers, setCountUsers] = useState(0);
  const [maxCount, setMaxCount] = useState(0);
  const [minCount, setMinCount] = useState(0);
  const [aCount, setACount] = useState(0);
  const [users, setUsers] = useState({});

  useEffect(() => api.usersSessionCount.subscribe(setCountUsers));
  useEffect(() => api.gameStage.subscribe(setStage));
  useEffect(() => api.gameUsers.subscribe(setUsers));

  useEffect(() => api.maxCount.subscribe(setMaxCount));
  useEffect(() => api.minCount.subscribe(setMinCount));
  useEffect(() => api.averageCount.subscribe(setACount));

  const isMobile = window.innerWidth <= 460;
  const values = clone(users);

  Object.keys(values).forEach((item) => {
    values[item].percentage = +((values[item].returnCount / values[item].count) * 100).toFixed(2);
    values[item].lose = values[item].totalBet - values[item].totalReturn;
  });

  const show = Object.values(values)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  return (
    <Box sx={main}>
      <Box sx={tableMain}>
        <Box sx={headerBox}>
          <Box sx={stageBox}>
            <Typography sx={{ fontWeight: 'bold' }}>{stage}</Typography>
          </Box>
          <Box sx={tableHeader}>
            <Box sx={sxsBoxTotal}>
              <Typography>{isMobile ? 'CU' : 'CURRENT USERS:'}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{countUsers}</Typography>
            </Box>

            <Box sx={sxsBoxTotal}>
              <Typography>{isMobile ? 'MaU' : 'MAX USERS:'}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{maxCount}</Typography>
            </Box>

            <Box sx={sxsBoxTotal}>
              <Typography>{isMobile ? 'MiU' : 'MIN USERS:'}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{minCount}</Typography>
            </Box>

            <Box sx={sxsBoxTotal}>
              <Typography>{isMobile ? 'AU' : 'AVERAGE USERS:'}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{aCount.toFixed(1)}</Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='right'>{isMobile ? 'ID' : 'USER ID'}</TableCell>
                <TableCell align='right'>{isMobile ? 'GC' : 'GAMES COUNT'}</TableCell>

                <TableCell align='right'>{isMobile ? 'MaB' : 'PERCENTAGE'}</TableCell>

                <TableCell align='right'>{isMobile ? 'MaB' : 'MAX BET'}</TableCell>
                <TableCell align='right'>{isMobile ? 'MiB' : 'MIN BET'}</TableCell>
                <TableCell align='right'>{isMobile ? 'B' : 'AVERAGE BET'}</TableCell>

                <TableCell align='right'>{isMobile ? 'MaB' : 'MAX RETURN'}</TableCell>
                <TableCell align='right'>{isMobile ? 'MiB' : 'MIN RETURN'}</TableCell>
                <TableCell align='right'>{isMobile ? 'B' : 'AVERAGE RETURN'}</TableCell>

                <TableCell align='right'>{isMobile ? 'W' : 'LOSE'}</TableCell>
                <TableCell align='right'>{isMobile ? 'W' : 'PERCENTAGE LOSE'}</TableCell>

                <TableCell align='right'>{isMobile ? 'Ra' : 'MAX RATIO'}</TableCell>
                <TableCell align='right'>{isMobile ? 'Ra' : 'MIN RATIO'}</TableCell>
                <TableCell align='right'>{isMobile ? 'Ra' : 'AVERAGE RATIO'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {show.map((item: any, idx) => (
                <TableRow key={idx}>
                  <TableCell align='right'>{item.userId}</TableCell>
                  <TableCell align='right'>{item.count}</TableCell>
                  <TableCell align='right'>{item.percentage}%</TableCell>

                  <TableCell align='right'>{getNumber(item.maxBet)}</TableCell>
                  <TableCell align='right'>{getNumber(item.minBet)}</TableCell>
                  <TableCell align='right'>{getNumber(item.aBet)}</TableCell>

                  <TableCell align='right'>{getNumber(item.maxReturn)}</TableCell>
                  <TableCell align='right'>{getNumber(item.minReturn)}</TableCell>
                  <TableCell align='right'>{getNumber(item.aReturn)}</TableCell>

                  <TableCell align='right' sx={{ color: item.lose > 0 ? '#F05454' : 'green' }}>
                    {getNumber(item.lose)}
                  </TableCell>

                  <TableCell align='right' sx={{ color: item.lose > 0 ? '#F05454' : 'green' }}>
                    {((item.totalReturn / item.totalBet || 0) * 100).toFixed(1)}%
                  </TableCell>

                  <TableCell align='right'>{item.maxRatio}</TableCell>
                  <TableCell align='right'>{item.minRatio}</TableCell>
                  <TableCell align='right'>{item.aRatio.toFixed(2)}</TableCell>
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

export default TableUsers;
