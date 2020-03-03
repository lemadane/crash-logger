import { config } from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morganBody from 'morgan-body';
import * as log from 'fancy-log';
import { logsRoutes, redisRoutes, recipientsRoutes } from './routes';
import * as redis from './common/redis';

config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded());
morganBody(app);
app.use('/api/v01/redis', redisRoutes);
app.use('/api/v01/logs', logsRoutes);
app.use('/api/v01/email-recipients/', recipientsRoutes);

const { PORT, NODE_ENV } = process.env;
app.listen(PORT || 10000, () => {
    log(`Server is running in '${NODE_ENV}' mode at port ${PORT || 10000}.`);
});

process.on('uncaughtException', (err: Error) => {
    log.error('uncaughtException', err);
    process.exit(1);
});

process.on('unhandledRejection', (err: Error) => {
    redis.disconnect();
    log.error('unhandledRejection', err);
    process.exit(1);
});

process.on('warning', (err) => {
    log.error('warning', err);
});