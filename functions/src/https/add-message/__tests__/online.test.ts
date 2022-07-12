import {expect} from 'chai';
import * as admin from 'firebase-admin';
import {HttpsFunction} from 'firebase-functions';
import {FeaturesList} from 'firebase-functions-test/lib/features';
import {adminConfig} from '~/test-lib/config';
import {getFirebaseTestOnline} from '~/test-lib/utils';

describe('addMessage - online', async () => {
  let test: FeaturesList;
  let addMessage: HttpsFunction;

  before(async () => {
    test = getFirebaseTestOnline();
    addMessage = (await import('~/index')).addMessage;
  });

  after(async () => {
    test.cleanup();
    // Reset the database.
    await admin.database().ref('messages').remove();
  });

  it('should return a 303 redirect - online', (done) => {
    // A fake request object, with req.query.text set to 'input'
    const req: any = {query: {text: 'input'}};
    // A fake response object, with a stubbed redirect function which does some assertions
    const res: any = {
      redirect(code: number, url: string) {
        // Assert code is 303
        expect(code).to.equal(303);
        // If the database push is successful, then the URL sent back will have the following format:
        const pattern = `${adminConfig.databaseURL}/messages/`;
        const expectedRef = new RegExp(pattern);

        try {
          expect(expectedRef.test(url)).to.be.true;
          done();
        } catch (e) {
          done(e);
        }
      },
    };

    // Invoke addMessage with our fake request and response objects. This will cause the
    // assertions in the response object to be evaluated.
    addMessage(req, res);
  });
});
