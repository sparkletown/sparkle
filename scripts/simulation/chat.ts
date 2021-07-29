import { strict as assert } from "assert";
import chalk from "chalk";

import { SimulatorContext } from "../simulator";

import { sendBotVenueMessage as actualSendBotVenueMessage } from "../lib/bot";
import { withErrorReporter } from "../lib/log";
import { sleep } from "../lib/utils";

export const DEFAULT_CHAT_CHUNK_SIZE = 100;
export const DEFAULT_CHAT_TICK_MS = 1000;
export const DEFAULT_CHAT_AFFINITY = 0.005;

export const simChat: (options: SimulatorContext) => Promise<void> = async (
  options
) => {
  const { userRefs, venueRef, conf, stop } = options;

  const affinity =
    conf.chat?.affinity ?? conf.affinity ?? DEFAULT_CHAT_AFFINITY;
  const tick = conf.chat?.tick ?? conf.tick ?? DEFAULT_CHAT_TICK_MS;
  const chunkSize =
    conf.chat?.chunkSize ?? conf.chunkSize ?? DEFAULT_CHAT_CHUNK_SIZE;

  assert.ok(
    Number.isSafeInteger(chunkSize) && chunkSize > 0,
    chalk`${simChat.name}(): {magenta chunkCount} must be integer {yellow > 0}`
  );

  assert.ok(
    Number.isFinite(tick) && tick >= 10,
    chalk`${simChat.name}(): {magenta tick} must be integer {yellow >= 10}`
  );

  assert.ok(
    0 <= affinity && affinity <= 1,
    chalk`${simChat.name}(): {magenta affinity} must be a number {yellow from 0 to 1}`
  );

  const sendMessage = withErrorReporter(conf.log, actualSendBotVenueMessage);

  // flag that will not let loop going on when user pressed CTRL+C
  let isStopped = false;
  stop.then(() => (isStopped = true));

  const loop = async () => {
    for (let i = 0, j = userRefs.length; !isStopped && i < j; i += chunkSize) {
      await Promise.all(
        userRefs
          .slice(i, i + chunkSize)
          .map(
            async (userRef) =>
              Math.random() < affinity &&
              sendMessage({ ...options, userRef, venueRef })
          )
      );
      // explicit sleep between the chunks
      !isStopped && (await sleep(tick));
    }

    // implicit sleep between the loops
    !isStopped && setTimeout(loop, tick);
  };

  // start looping the chat updates
  await loop();
};
