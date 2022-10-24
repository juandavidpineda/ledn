import config from 'config';
import connect from './database/connect';
import createServer from './utils/server';

const app = createServer();

const hostname: string = config.get('host');
const port: number = config.get('port');

app.listen(port, hostname, async () => {
  console.log(`App Running on http://${hostname}:${port}`);

  // Connect to DB
  await connect();
});
