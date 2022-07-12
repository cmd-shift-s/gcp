import {https, logger} from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export * from './https';
export * from './database';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = https.onRequest((req, res) => {
  const msg = req.query.msg || 'World';
  logger.info(`Hello ${msg}!`, {structuredData: true});
  res.send(`Hello ${msg}!`);
});
