import mongoose from 'mongoose';
import config from 'config';

const connect = () => {
  const dbUri: string = config.get('dbUri');
  return mongoose
    .connect(dbUri)
    .then(() => {
      console.log('Mongo Atlas Started');
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

export default connect;
