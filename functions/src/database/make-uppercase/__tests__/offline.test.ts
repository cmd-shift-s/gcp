import {expect} from 'chai';
import {CloudFunction} from 'firebase-functions';
import {FeaturesList} from 'firebase-functions-test/lib/features';
import {DataSnapshot} from 'firebase-functions/lib/providers/database';
import * as sinon from 'sinon';
import {getFirebaseTestOffline, stubInitializeApp} from '~/test-lib/utils';

describe('makeUppercase - offline', () => {
  let test: FeaturesList;
  let adminInitStub: sinon.SinonStub;
  let makeUppercase: CloudFunction<DataSnapshot>;

  before(async () => {
    test = getFirebaseTestOffline();
    adminInitStub = stubInitializeApp();
    makeUppercase = (await import('~/index')).makeUppercase;
  });

  after(() => {
    adminInitStub.restore();
    test.cleanup();
  });

  // Test Case: setting messages/{pushId}/original to 'input' should cause 'INPUT' to be written to
  // messages/{pushId}/uppercase
  it('should upper case input and write it to /uppercase - offline', () => {
    // [START assertOffline]
    const childParam = 'uppercase';
    const setParam = 'INPUT';
    // Stubs are objects that fake and/or record function calls.
    // These are excellent for verifying that functions have been called and to validate the
    // parameters passed to those functions.
    const childStub = sinon.stub();
    const setStub = sinon.stub();
    // [START fakeSnap]
    // The following lines creates a fake snapshot, 'snap', which returns 'input' when snap.val() is called,
    // and returns true when snap.ref.parent.child('uppercase').set('INPUT') is called.
    const snap = {
      val: () => 'input',
      ref: {
        parent: {
          child: childStub,
        },
      },
    };
    childStub.withArgs(childParam).returns({set: setStub});
    setStub.withArgs(setParam).returns(true);
    // [END fakeSnap]
    // Wrap the makeUppercase function.
    const wrapped = test.wrap(makeUppercase);
    // Since we've stubbed snap.ref.parent.child(childParam).set(setParam) to return true if it was
    // called with the parameters we expect, we assert that it indeed returned true.
    expect(wrapped(snap)).to.be.true;

    // [END assertOffline]
  });
});
