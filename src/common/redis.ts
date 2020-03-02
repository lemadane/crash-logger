import { isString } from 'lodash';
import * as redis from 'redis';
import * as log from 'fancy-log';
import { MethodFailure } from './err';

let redisClient: redis.RedisClient = null;

export const connect = async (): Promise<redis.RedisClient> => new Promise((resolve, reject) => {
   if (!redisClient || !redisClient.connected) {
      try {
         log('Connecting to Redis...');
         redisClient = redis.createClient({ detect_buffers: true });
      }
      catch (error) {
         log.error('Could not connect to Redis...', error.message);
         reject(new MethodFailure({ error, message: 'Could not connect to Redis cache.' }));
         return;
      }
   }
   resolve(redisClient);
});

export const disconnect = async () => {
   if(!(redisClient && redisClient.connected)) {
      return 'OK';
   }
   return new Promise((resolve, reject) => {
      redisClient.quit((error, reply) => {
         if (error) {
            log.error(error.message);
            reject(new MethodFailure({ error }));
            return;
         }
         resolve(reply);
      });
   });
};

export const save = async (key: any, value: any) => {
   let stringValue: string = null;
   const client = await connect();
   if (isString(value)) {
      stringValue = value;
   } else {
      stringValue = JSON.stringify(value);
   }
   return new Promise((resolve, reject) => {
      client.set(key.toString(), stringValue,
         async (error, reply) => {
            if (error) {
               reject(new MethodFailure({ error }));
            }
            resolve(reply);
         }
      );
   });
};

export const saveExpire = async (key: any, value: any, seconds: number) => {
   let stringValue: string = null;
   const client = await connect();
   if (isString(value)) {
      stringValue = value;
   } else {
      stringValue = JSON.stringify(value);
   }
   return new Promise((resolve, reject) => {
      client.setex(key.toString(), seconds, stringValue,
         async (error, reply) => {
            if (error) {
               reject(new MethodFailure({ error }));
               return;
            }
            resolve(reply);
         }
      );
   });
};

export const read = async (key: any) => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.get(key.toString(), async (error, data) => {
         if (error) {
            log.error(error.message);
            reject(new MethodFailure({ error }));
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

export const drop = async (key: any) => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.del(key.toString(),
         async (error, reply) => {
            if (error) {
               reject(new MethodFailure({ error }));
               return;
            }
            resolve(reply);
         }
      );
   });
};

export const clearCache = async () => {
   const client = await connect();
   return new Promise((resolve, reject) => {
      client.flushall( async (error, reply) => {
         if (error) {
            reject(new MethodFailure({ message: error.message }));
         }
         else {
            resolve(reply);
         }
      });
   });
};

// async function test() {
//    const reply = await save('lem', 'hello');
//    log('saved: ', reply);
//    let data = await read('lem');
//    log('data: ', data);
//    await drop('lem');
//    data = await read('lem');
//    log('data: ', data);
//    log('cleared: ', await clearCache());
//    process.exit(0);
// }
// test();
