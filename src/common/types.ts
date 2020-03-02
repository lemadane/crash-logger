export type ExceptionInputs = {
   response?: Response;
   status?: number;
   title?: string;
   message?: string;
   tip?: string;
   lang?: string;
   tag?: object;
   error?: Error;
};