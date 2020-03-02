import ExtendableError from 'ts-error';
import { ExceptionInputs } from './types';
import * as http from './http-status';
/*
* Extendable error extends JS Error
*/
export class Exception extends ExtendableError {

   name: string = '';

   status: number = 500;

   title: string = '';

   message: string = '';

   lang: string = 'en';

   tip?: string;

   tag?: object;

   constructor(inputs: ExceptionInputs) {
      super();
      this.name = this.constructor.name;
      this.status = inputs.status || this.status;
      this.title = inputs.title || this.title;
      this.message = inputs.error.message || inputs.message || this.message;
      this.tip = inputs.tip || this.tip;
      this.tag = inputs.tag || this.tag;
      this.lang = inputs.lang || this.lang;
      this.stack = inputs.error.stack || this.stack;
   }
}

export class BadRequest extends Exception {
   status = http.BAD_REQUEST;

   title = 'Bad Request.';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class Unauthorized extends Exception {
   status = http.UNAUTHORIZED;

   title = 'Unathorized';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class Forbidden extends Exception {
   status = http.FORBIDDEN;

   title = 'Forbidden.';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class NotFound extends Exception {
   status = http.NOT_FOUND;

   title = 'Data not found.';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class RequestTimeout extends Exception {
   status = http.REQUEST_TIMEOUT;

   title = 'Request Timeout.';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class Conflict extends Exception {
   status = http.CONFLICT;

   title = 'Conflict';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class UnprocessableEntity extends Exception {
   status = http.UNPROCESSABLE_ENTITY;

   title = 'Unprocessable Entity';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class MethodFailure extends Exception {
   status = http.METHOD_FAILURE;

   title = 'Method Failure';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class SystemError extends Exception {
   status = http.INTERNAL_SERVER_ERROR;

   title = 'System Error.';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class MissingParameter extends UnprocessableEntity {
   title = 'Missing parameter.';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class InvalidParameter extends UnprocessableEntity {
   title = 'Invalid parameter';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class MissingAccessToken extends Unauthorized {
   title = 'Missing Access Token';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class InvalidAccessToken extends Unauthorized {
   title = 'Invalid Access Token';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}

export class ServiceUnavailable extends Exception {
   status = http.SERVICE_UNAVAILABLE;

   title = 'Service is Not Available';

   constructor(inputs: ExceptionInputs) {
      super(inputs);
   }
}