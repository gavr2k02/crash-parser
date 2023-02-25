import { Box } from '@mui/material';

import { useEffect, useState } from 'react';
import { api } from './services';
import ConfigBox from './components/ConfigBox';
import TableUsers from './components/TableUsers';
import TableSessions from './components/TableSessions';
import Menu from './components/SideBar';
import Bot from './components/Bot';

const DEFAULT_URL =
  'wss://crash.get-x.site/socket.io/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5nZXQteC5zaXRlL2F1dGgvcmVnaXN0ZXIvb25lX2NsaWNrIiwiaWF0IjoxNjc2OTY0NTgzLCJleHAiOjE2NzczOTY1ODMsIm5iZiI6MTY3Njk2NDU4MywianRpIjoieFBTZ0JiWUtaSFhyR1JlbSIsInN1YiI6OTQ0ODkwLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwiaWQiOjk0NDg5MCwicm9sZSI6InVzZXIiLCJuYW1lIjoiTWljaGVsbGUgQW5kZXJzb24iLCJoYXNoIjoiYWNlYmM4MmEwNjAzMGZmYzY5NzdkNTI1YmYyZTQwYTcxMDZhNzIzZSIsInBob3RvX3NtIjoiaHR0cHM6Ly9nZXR4LWF2YXRhcnMuczMuZXUtY2VudHJhbC0wMDMuYmFja2JsYXplYjIuY29tL2F2YXRhci5zdmciLCJwaG90b19tZCI6Imh0dHBzOi8vZ2V0eC1hdmF0YXJzLnMzLmV1LWNlbnRyYWwtMDAzLmJhY2tibGF6ZWIyLmNvbS9hdmF0YXIuc3ZnIiwicGhvdG9fbGciOiJodHRwczovL2dldHgtYXZhdGFycy5zMy5ldS1jZW50cmFsLTAwMy5iYWNrYmxhemViMi5jb20vYXZhdGFyLnN2ZyJ9.AEKI8wcqXzOBlvTwzx8nBFz8Zs7beF6Y6rQTQxT3kRA&EIO=4&transport=websocket';

function App() {
  const [started, setStarted] = useState(false);
  const [url, setUrl] = useState<string>();
  const [page, setPage] = useState('sessions');

  const components = {
    sessions: <TableSessions />,
    users: <TableUsers />,
    bot: <Bot />,
  };

  useEffect(() => {
    started && api.init(url || DEFAULT_URL);
  }, [started]);

  return (
    <Box sx={main}>
      <Menu setPage={setPage} />
      {!started ? <ConfigBox setUrl={setUrl} url={url} handleStartClick={() => setStarted(true)} /> : components[page]}
    </Box>
  );
}

const main = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#222831',
};

export default App;
