import {https} from 'firebase-functions';
import {database} from 'firebase-admin';

// [START addMessage]
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// [START addMessageTrigger]
export const addMessage = https.onRequest(async (req, res) => {
  // [END addMessageTrigger]
  // Grab the text parameter.
  const original = req.query.text;
  // [START adminSdkPush]
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await database().ref('/messages').push({original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
  // [END adminSdkPush]
});
// [END addMessage]
