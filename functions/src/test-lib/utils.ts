import * as firebaseTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as sinon from 'sinon';
import {adminConfig} from './config';

export function getFirebaseTestOnline() {
  return getFirebaseTest(true);
}

export function getFirebaseTestOffline() {
  return getFirebaseTest(false);
}

function getFirebaseTest(online = true) {
  return online ?
    firebaseTest(adminConfig) :
    firebaseTest();
}


export function stubInitializeApp() {
  return sinon.stub(admin, 'initializeApp');
}
