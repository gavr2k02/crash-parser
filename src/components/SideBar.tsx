import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MenuIcon from '@mui/icons-material/Menu';

type Props = {
  setPage: (value: string) => void;
};

export default function Menu({ setPage }: Props) {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor: any, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: any) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Sessions Analytics', 'Users Analytics'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => setPage(text === 'Sessions Analytics' ? 'sessions' : 'users')}>
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Bot'].map((text, index) => {
          return (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => setPage('bot')}>
                <ListItemIcon>
                  <SmartToyIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Box sx={menuBox} onClick={toggleDrawer('left', true)}>
          <MenuIcon sx={icon} />
        </Box>
        <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
          {list('left')}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

const menuBox = {
  width: '4vh',
  height: '4vh',
  position: 'absolute',

  left: '15px',
  top: '15px',
};

const icon = {
  width: '100%',
  height: '100%',
  color: 'white',
};
