export type SadTalkerJobOptions = {
  resolution?: "256p" | "512p";
  enhancer?: string | null;
  backgroundEnhancer?: string | null;
  preprocess?: string | null;
  poseStyle?: number;
  expressionScale?: number;
  still?: boolean;
  batchSize?: number;
  inputYaw?: number[] | null;
  inputPitch?: number[] | null;
  inputRoll?: number[] | null;
};

export type SadTalkerFilePayload = {
  filename: string;
  contentType: string;
  data: string; // base64
  size: number;
};

export type SadTalkerJobPayload = {
  userId: string;
  requestId?: string;
  imageUrl?: string;
  audioUrl?: string;
  imageFile?: SadTalkerFilePayload;
  audioFile?: SadTalkerFilePayload;
  webhookUrl?: string | null;
  metadata?: Record<string, unknown>;
  options?: SadTalkerJobOptions;
};

export type SadTalkerJobResult = {
  videoUrl: string;
  storageProvider?: string;
  durationSec?: number;
};

export type SadTalkerJobError = {
  message: string;
  reason?: string;
};
