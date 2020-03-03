import { Request, Response } from 'express';
import * as redis from './common/redis';
import { INTERNAL_SERVER_ERROR, CREATED, OK } from './common/http-status';

const LOGS = 'logs';

export const create = async (req: Request, res: Response) => {
   try {
      const logged = req.body;
      const timestamp = new Date();
      logged.collection = LOGS,
      logged.id = timestamp.valueOf();
      logged.created = timestamp;
      await redis.save(LOGS, logged.id.toString(), logged);
      res.status(CREATED).send({
         success: true,
         timestamp: logged.created,
         logged,
      });
   } catch (error) {
      await redis.disconnect();
      res.status(error.status || INTERNAL_SERVER_ERROR).send({
         success: false,
         timestamp: new Date(),
         message: error.message || 'Unexpected error occurred.',
      });
   }
};

export const getByID = async (req: Request, res: Response) => {
   try {
      const id = req.params.id;
      const read = await redis.read(LOGS, id);
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         read,
      });
   } catch (error) {
      await redis.disconnect();
      res.status(error.status || INTERNAL_SERVER_ERROR).send({
         success: false,
         timestamp: new Date(),
         message: error.message || 'Unexpected error occurred.',
      });
   }
};


export const getAll = async (_: Request, res: Response) => {
   try {
      const logs = await redis.readAll(LOGS) as any[];
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         count: logs ? logs.length : 0,
         logs,
      });
   } catch (error) {
      await redis.disconnect();
      res.status(error.status || INTERNAL_SERVER_ERROR).send({
         success: false,
         timestamp: new Date(),
         message: error.message || 'Unexpected error occurred.',
      });
   }
};

export const deleteByID = async (req: Request, res: Response) => {
   try {
      const id = req.params.id;
      const deleted = await redis.read(LOGS, id);
      await redis.deleteByID(LOGS, id);
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         deleted,
      });
   } catch (error) {
      await redis.disconnect();
      res.status(error.status || INTERNAL_SERVER_ERROR).send({
         success: false,
         timestamp: new Date(),
         message: error.message || 'Unexpected error occurred.',
      });
   }
};

export const deleteAll = async (_: Request, res: Response) => {
   try {
      await redis.deleteAll(LOGS);
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         message: 'All logs deleted.',
      });
   } catch (error) {
      await redis.disconnect();
      res.status(error.status || INTERNAL_SERVER_ERROR).send({
         success: false,
         timestamp: new Date(),
         message: error.message || 'Unexpected error occurred.',
      });
   }
};