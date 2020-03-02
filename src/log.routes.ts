import { Router } from 'express';
import { create, getByID, drop, disconnect, clearCache, connect, } from './log.controllers';

const logRoutes = Router()
   .post('/', create)
   .get('/:id', getByID)
   .delete('/:id', drop)
   .post('/connect', connect)
   .post('/disconnect', disconnect)
   .post('/clear-cache', clearCache);

export default logRoutes;