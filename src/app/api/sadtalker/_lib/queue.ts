import type { Queue } from "bullmq";

const QUEUE_NAME = "sadtalker-jobs";

declare global {
  // eslint-disable-next-line no-var
  var __sadtalkerQueue: Queue | undefined;
}

export function getSadTalkerQueue(): Queue {
  if (!global.__sadtalkerQueue) {
    const { Queue } = require("bullmq") as { Queue: typeof import("bullmq").Queue };
    const { getRedis } = require("./redis") as { getRedis: typeof import("./redis").getRedis };
    global.__sadtalkerQueue = new Queue(QUEUE_NAME, {
      connection: getRedis(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 10000 },
        removeOnComplete: { age: 3600, count: 500 },
        removeOnFail: { age: 86400 },
      },
    });
  }
  return global.__sadtalkerQueue;
}

export const SADTALKER_QUEUE_NAME = QUEUE_NAME;
