import Redis from "ioredis";

import { sadTalkerConfig } from "./config";

declare global {
  // eslint-disable-next-line no-var
  var __sadtalkerRedisClient: Redis | undefined;
}

export function getRedis(): Redis {
  if (!global.__sadtalkerRedisClient) {
    global.__sadtalkerRedisClient = new Redis(sadTalkerConfig.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
  }
  return global.__sadtalkerRedisClient;
}
