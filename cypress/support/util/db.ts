import * as fetch from "isomorphic-fetch";

const PROTOCOL = process.env.REACT_APP_FIRE_EMULATE_PROTOCOL || `http`;
const HOST = process.env.REACT_APP_FIRE_EMULATE_HOST || "127.0.0.1";
const HUB_PORT = 4400;
const FIRESTORE_PORT = 8080;

// NOTE: use the demo- prefix, @see https://firebase.google.com/docs/emulator-suite/connect_firestore
const PROJECT_ID = "demo-cypress-test";

type AssertOk = (options: {
  message: string;
  response: Response | Promise<Response>;
}) => Promise<void>;

const assertOk: AssertOk = async ({ response, message }) => {
  // simple unwrap in case of Promise
  response = response instanceof Promise ? await response : response;

  if (response.status === 200) {
    return;
  }

  const text = await response.text();
  throw new Error(`${message}: ${text}`);
};

/**
 *  Flushing all of Firestore data, only for emulators.
 *  As per @see https://firebase.google.com/docs/emulator-suite/connect_firestore
 *  production Firestore provides no platform SDK method for flushing the database
 */
const emulatorsFirebaseClear = async () => {
  const uri = `${PROTOCOL}://${HOST}:${FIRESTORE_PORT}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
  await assertOk({
    message: `Trouble clearing firestore emulator with ${uri}`,
    response: fetch(uri, { method: "DELETE" }),
  });
};

/**
 * Useful to disable all triggers while modifying the Firestore data to suit particular test
 */
const emulatorsBackgroundTriggersEnable = async () =>
  await assertOk({
    message: "Trouble enabling database triggers in emulator",
    response: fetch(
      `${PROTOCOL}://${HOST}:${HUB_PORT}/functions/enableBackgroundTriggers`,
      {
        method: "PUT",
      }
    ),
  });

/**
 * Needed to re-enable all triggers after modifying the Firestore data to suit particular test
 */
const emulatorsBackgroundTriggersDisable = async () =>
  await assertOk({
    message: "Trouble disabling database triggers in emulator",
    response: fetch(
      `${PROTOCOL}://${HOST}:${HUB_PORT}/functions/disableBackgroundTriggers`,
      {
        method: "PUT",
      }
    ),
  });

type ResetFirebase = <T>(fn?: () => T) => Promise<T | undefined>;

/**
 *
 * Utility to reset the Firebase DB to empty
 * and, optionally, pre-seed with data to suit particular test
 *
 * @param fn - Function that should set the data
 *
 * @return - The result of fn or undefined
 */
export const emulatorsResetFirebase: ResetFirebase = async (fn) => {
  await emulatorsBackgroundTriggersDisable();
  await emulatorsFirebaseClear();

  // must wait for the DB job to be completed before reinstating the triggers
  const result = fn?.();
  if (result instanceof Promise) {
    await result;
  }

  await emulatorsBackgroundTriggersEnable();

  return result;
};
