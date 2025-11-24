import serverlessExpress from '@vendia/serverless-express';
import expressApp from './app.js'; // Use .js extension for local file imports

// serverlessExpress({ app }) returns a function that acts as the Lambda handler.
// We only initialize this once, outside the main handler function,
// to benefit from the Lambda execution environment reuse (faster cold starts).

// The exported 'handler' is the actual entry point Lambda will execute.
export const handler = serverlessExpress({ app: expressApp });

// Note: With this structure, your Express app is initialized outside the 
// handler and is ready to serve traffic on the first and all subsequent calls.