import {expect} from 'chai';
import * as admin from 'firebase-admin';
import {CloudFunction} from 'firebase-functions';
import {FeaturesList} from 'firebase-functions-test/lib/features';
import {DataSnapshot} from 'firebase-functions/lib/providers/database';
import {getFirebaseTestOnline} from '~/test-lib/utils';

describe('makeUppercase - online', () => {
  let test: FeaturesList;
  let makeUppercase: CloudFunction<DataSnapshot>;

  before(async () => {
    test = getFirebaseTestOnline();
    makeUppercase = (await import('~/index')).makeUppercase;
  });

  after(async () => {
    test.cleanup();
    // Reset the database.
    await admin.database().ref('messages').remove();
  });

  // Test Case: setting messages/11111/original to 'input' should cause 'INPUT' to be written to
  // messages/11111/uppercase
  it('should upper case input and write it to /uppercase - online', () => {
    // [START assertOnline]
    // Create a DataSnapshot with the value 'input' and the reference path 'messages/11111/original'.
    const snap = test.database
        .makeDataSnapshot('input', 'messages/11111/original');

    // Wrap the makeUppercase function
    const wrapped = test.wrap(makeUppercase);
    // Call the wrapped function with the snapshot you constructed.
    return wrapped(snap).then(() => {
      // Read the value of the data at messages/11111/uppercase. Because `admin.initializeApp()` is
      // called in functions/index.js, there's already a Firebase app initialized. Otherwise, add
      // `admin.initializeApp()` before this line.
      // eslint-disable-next-line promise/no-nesting
      return admin.database().ref('messages/11111/uppercase')
          // eslint-disable-next-line promise/always-return
          .once('value').then((createdSnap) => {
            // Assert that the value is the uppercased version of our input.
            expect(createdSnap.val(), 'INPUT');
          });
    });
    // [END assertOnline]
  });
});
