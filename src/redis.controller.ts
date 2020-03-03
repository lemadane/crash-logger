import { Request, Response } from 'express';
import * as redis from './common/redis';
import { INTERNAL_SERVER_ERROR, OK } from './common/http-status';

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
