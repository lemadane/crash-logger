import { Router } from 'express';
import {
   create, getByID, getAll, deleteByID, deleteAll, disconnect, clearCache, connect,
} from './controllers';

export const logsRoutes = Router()
   .post('/', create)
   .get('/:id', getByID)
   .get('/', getAll)
   .delete('/:id', deleteByID)
   .delete('/', deleteAll)
   
export const redisRoutes = Router()
   .post('/connect', connect)
   .post('/disconnect', disconnect)
   .post('/clear-cache', clearCache);