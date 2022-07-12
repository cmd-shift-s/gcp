import * as admin from 'firebase-admin';

after(() => {
  admin.apps[0]?.delete();
});
