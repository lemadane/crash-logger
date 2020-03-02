import { config } from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morganBody from 'morgan-body';
import * as log from 'fancy-log';
import { logsRoutes, redisRoutes } from './routes';
import * as redis from './common/redis';
try {
    config();
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded());
    morganBody(app);

    app.use('/api/v01/redis', redisRoutes);
    app.use('/api/v01/logs', logsRoutes);

    const { PORT, NODE_ENV } = process.env;
    app.listen(PORT || 10000, () => {
        log(`Server is running in '${NODE_ENV}' mode at port ${PORT || 10000}.`);
    });
} catch (er) {
    redis.disconnect();
    log.error(er);
    process.exit(1);
}