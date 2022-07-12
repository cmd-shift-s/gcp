require('dotenv').config();

interface IFirebaseConfig {
  databaseURL: string;
  storageBucket: string;
  projectId: string;
}

export const adminConfig: IFirebaseConfig =
  JSON.parse(process.env.FIREBASE_CONFIG!);
