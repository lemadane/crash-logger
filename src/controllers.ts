import { Request, Response } from 'express';
import * as redis from './common/redis';
import { INTERNAL_SERVER_ERROR, CREATED, OK } from './common/http-status';

export const create = async (req: Request, res: Response) => {
   try {
      const logged = req.body;
      const timestamp = new Date();
      logged.collection = 'logs',
      logged.id = timestamp.valueOf().toString();
      logged.created = timestamp;
      logged.emailed = false;
      await redis.save('logs', logged.id, logged);
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
      const read = await redis.read('logs', id);
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
      const logs = await redis.readAll('logs') as any[];
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
      const data = await redis.read('logs', id);
      await redis.deleteByID('logs', id);
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         deleted: data,
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
      await redis.deleteAll('logs');
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

export const clearCache = async (_: Request, res: Response) => {
   try {
      await redis.clearCache();
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         message: 'Redis cache is cleared.',
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

export const connect = async (_: Request, res: Response) => {
   try {
      await redis.connect();
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         message: 'Redis is connected.',
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

export const disconnect = async (_: Request, res: Response) => {
   try {
      await redis.disconnect();
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         message: 'Redis is disconnected.',
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
