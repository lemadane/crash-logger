import { Router } from 'express';
import {
   create, getByID, getAll, deleteByID, deleteAll,
} from './logs.controller';
import {
   create as createRecipent,
   update as getByRecipientID,
   getAll as getAllRecipient,
   deleteByID as deleteByRecipientID,
   deleteAll as deleteAllRecipients,
   update as updateRecipient,
} from './email-recipients.controller';
import {
   disconnect, clearCache, connect,
} from './redis.controller';

export const logsRoutes = Router()
   .post('/', create)
   .get('/:id', getByID)
   .get('/', getAll)
   .delete('/:id', deleteByID)
   .delete('/', deleteAll);

export const recipientsRoutes = Router()
   .post('/', createRecipent)
   .get('/:id', getByRecipientID)
   .get('/', getAllRecipient)
   .put('/:id', updateRecipient)
   .delete('/:id', deleteByRecipientID)
   .delete('/', deleteAllRecipients);

export const redisRoutes = Router()
   .post('/connect', connect)
   .post('/disconnect', disconnect)
   .post('/clear-cache', clearCache);