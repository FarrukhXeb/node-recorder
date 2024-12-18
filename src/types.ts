// Socket Events

export enum SocketEvents {
  // Connection events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  ERROR = 'error',

  // Recording events
  STREAM_VIDEO = 'stream-video',
  JOIN_RECORDING_SESSION = 'join-recording-session',
  LEAVE_RECORDING_SESSION = 'leave-recording-session',
  FINISHED_STREAMING = 'finished-streaming',
}

export type StreamData = {
  chunk: string | Buffer;
  isLastChunk: boolean;
};

export interface SequelizeConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  use_env_variable?: string;
}
