import { isString } from 'lodash';
import * as redis from 'redis';
import * as log from 'fancy-log';
import { SystemError } from './err';

let redisClient: redis.RedisClient = null;

export const connect = async (): Promise<redis.RedisClient> => new Promise((resolve, reject) => {
   if (!redisClient || !redisClient.connected) {
      try {
         log('Connecting to Redis...');
         redisClient = redis.createClient({ detect_buffers: true });
      }
      catch (error) {
         log.error('Could not connect to Redis...', error.message);
         reject(new SystemError({ error, message: 'Could not connect to Redis cache.' }));
         return;
      }
   }
   resolve(redisClient);
});

export const disconnect = async (): Promise<string> => {
   if (!(redisClient && redisClient.connected)) {
      return 'OK';
   }
   return new Promise((resolve, reject) => {
      redisClient.quit((error, reply) => {
         if (error) {
            log.error(error.message);
            reject(new SystemError({ error }));
            return;
         }
         resolve(reply);
      });
   });
};

export const save = async (collection: string, id: string, value: any): Promise<number> => {
   let stringValue: string = null;
   const client = await connect();
   if (isString(value)) {
      stringValue = value;
   } else {
      stringValue = JSON.stringify(value);
   }
   return new Promise((resolve, reject) => {
      client.hset(collection, id, stringValue, (error, reply) => {
         if (error) {
            reject(new SystemError({ error }));
         }
         resolve(reply);
      }
      );
   });
};


export const read = async (collection: string, id: string): Promise<any> => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.hget(collection, id, (error, data) => {
         if (error) {
            log.error(error.message);
            reject(new SystemError({ error }));
            return;
         }
         if (data && data.startsWith('{')) {
            resolve(JSON.parse(data));
         } else {
            resolve(data);
         }
      });
   });
};

export const exists = async (collection: string, id: string): Promise<boolean> => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.hexists(collection, id, (error, reply) => {
         if (error) {
            log.error(error.message);
            reject(new SystemError({ error }));
            return;
         }
         resolve(!!reply);
      });
   });
};

export const readAll = async (collection: string) => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.hgetall(collection, (error, data) => {
         if (error) {
            log.error(error.message);
            reject(new SystemError({ error }));
            return;
         }
         if (data) {
            const obj = JSON.parse(JSON.stringify(data));
            const results = Object.values(obj).map(value => {
               const val = value as string;
               if (val.startsWith('{')) {
                  return JSON.parse(val);
               } else {
                  return value;
               }
            });
            resolve(results);
            //resolve(null);
         } else {
            resolve(data);
         }
      });
   });
};

export const deleteByID = async (collection: string, id: string): Promise<boolean> => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.hdel(collection, id, (error, reply) => {
         if (error) {
            reject(new SystemError({ error }));
            return;
         }
         resolve(!!reply);
      }
      );
   });
};


export const deleteAll = async (collection: string): Promise<boolean> => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.del(collection, (error, reply) => {
         if (error) {
            reject(new SystemError({ error }));
            return;
         }
         resolve(!!reply);
      }
      );
   });
};

export const clearCache = async (): Promise<string> => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.flushall((error, reply) => {
         if (error) {
            reject(new SystemError({ message: error.message }));
         }
         else {
            resolve(reply);
         }
      });
   });
};
