import { Request, Response } from 'express';
import * as redis from './common/redis';
import { INTERNAL_SERVER_ERROR, CREATED, OK } from './common/http-status';

const RECIPIENTS = 'email-recipients';

export const create = async (req: Request, res: Response) => {
   try {
      const saved = req.body;
      const timestamp = new Date();
      saved.collection = RECIPIENTS,
      saved.id = timestamp.valueOf();
      saved.created = timestamp;
      await redis.save(RECIPIENTS, saved.id.toString(), saved);
      res.status(CREATED).send({
         success: true,
         timestamp: saved.created,
         saved,
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
      const read = await redis.read(RECIPIENTS, id);
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


export const update = async (req: Request, res: Response) => {
   try {
      const id = req.params.id;
      const updates = req.body;
      const read = await redis.read(RECIPIENTS, id);
      const updated = { ...read, ...updates };
      await redis.save(RECIPIENTS, id, read);
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         updated,
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
      const recipients = await redis.readAll(RECIPIENTS) as any[];
      res.status(OK).send({
         success: true,
         timestamp: new Date(),
         count: recipients ? recipients.length : 0,
         recipients,
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
      const deleted = await redis.read(RECIPIENTS, id);
      await redis.deleteByID(RECIPIENTS, id);
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
      await redis.deleteAll(RECIPIENTS);
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