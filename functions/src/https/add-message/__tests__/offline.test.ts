import {expect} from 'chai';
import * as admin from 'firebase-admin';
import {HttpsFunction} from 'firebase-functions';
import {FeaturesList} from 'firebase-functions-test/lib/features';
import * as sinon from 'sinon';
import {getFirebaseTestOffline, stubInitializeApp} from '~/test-lib/utils';

describe('addMessage - offline', () => {
  let test: FeaturesList;
  let adminInitStub: sinon.SinonStub;
  let addMessage: HttpsFunction;

  before(async () => {
    test = getFirebaseTestOffline();
    adminInitStub = stubInitializeApp();

    addMessage = (await import('~/index')).addMessage;
  });

  after(() => {
    adminInitStub.restore();
    test.cleanup();
  });

  it('should return a 303 redirect - offline', (done) => {
    const refParam = '/messages';
    const pushParam = {original: 'input'};
    const databaseStub = sinon.stub();
    const refStub = sinon.stub();
    const pushStub = sinon.stub();

    // The following lines override the behavior of admin.database().ref('/messages')
    // .push({ original: 'input' }) to return a promise that resolves with { ref: 'new_ref' }.
    // This mimics the behavior of a push to the database, which returns an object containing a
    // ref property representing the URL of the newly pushed item.

    // eslint-disable-next-line no-import-assign
    Object.defineProperty(admin, 'database', {
      get: () => databaseStub, configurable: true,
    });
    databaseStub.returns({ref: refStub});
    refStub.withArgs(refParam).returns({push: pushStub});
    pushStub.withArgs(pushParam).returns(Promise.resolve({ref: 'new_ref'}));

    // [START assertHTTP]
    // A fake request object, with req.query.text set to 'input'
    const req: any = {query: {text: 'input'}};
    // A fake response object, with a stubbed redirect function which asserts that it is called
    // with parameters 303, 'new_ref'.
    const res: any = {
      redirect: (code: number, url: string) => {
        expect(code).to.equal(303);
        expect(url).to.equal('new_ref');
        done();
      },
    };

    // Invoke addMessage with our fake request and response objects. This will cause the
    // assertions in the response object to be evaluated.
    addMessage(req, res);
    // [END assertHTTP]
  });
});
