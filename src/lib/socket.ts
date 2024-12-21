import { Server as HttpServer } from 'http';
import path from 'path';
import fs from 'fs';
import { Server, Socket } from 'socket.io';
import { SocketEvents, StreamData } from '@/types';
import logger from '@/lib/logger';
import { combineChunks, convertToMp4 } from '@/utils';

class SocketIOService {
  private static instance: SocketIOService;
  private io: Server;
  private recordingSessions: Map<string, string> = new Map();

  private constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on(SocketEvents.CONNECTION, this.onConnection.bind(this));
  }

  public static getInstance(server: HttpServer): SocketIOService {
    if (!SocketIOService.instance) {
      SocketIOService.instance = new SocketIOService(server);
    }
    return SocketIOService.instance;
  }

  private onConnection(socket: Socket): void {
    logger.info(`New client connected: ${socket.id}`);

    socket.emit(SocketEvents.MESSAGE, 'Welcome to my APP!');

    socket.on(SocketEvents.JOIN_RECORDING_SESSION, (recordingSession: string) => {
      if (!recordingSession) {
        socket.emit(SocketEvents.ERROR, 'Recording session is required');
        return;
      }

      socket.join(recordingSession);

      this.recordingSessions.set(socket.id, recordingSession);

      logger.info(`Client ${socket.id} joined recording session ${recordingSession}`);
    });

    socket.on(SocketEvents.LEAVE_RECORDING_SESSION, () => {
      const recordingSession = this.getRecordingSessionsBySocketId(socket.id);
      if (recordingSession) {
        socket.leave(recordingSession);
        this.recordingSessions.delete(socket.id);
        logger.info(`Client ${socket.id} left recording session ${recordingSession}`);
      }
    });

    socket.on(SocketEvents.DISCONNECT, async () => {
      const recordingSession = this.getRecordingSessionsBySocketId(socket.id);
      if (recordingSession) {
        this.recordingSessions.delete(recordingSession);
        logger.info(`Client ${socket.id} left recording session ${recordingSession}`);
        try {
          const file = await combineChunks(recordingSession);
          await convertToMp4(file, recordingSession);
        } catch (error) {
          logger.error(`Error combining chunks: ${error}`);
        }
      }
      logger.info(`Client disconnected: ${socket.id}`);
    });

    socket.on(SocketEvents.STREAM_VIDEO, this.streamRecording.bind(this, socket));
  }

  private getRecordingSessionsBySocketId(socketId: string): string | undefined {
    return this.recordingSessions.get(socketId);
  }

  /**
   * Screen Recording events
   */

  private streamRecording(socket: Socket, data: StreamData) {
    const recordingSession = this.getRecordingSessionsBySocketId(socket.id);

    if (!recordingSession) {
      socket.emit(SocketEvents.ERROR, 'You need to join a recording session first');
      return;
    }

    const uploadDir = path.join(process.cwd(), 'src', 'uploads', recordingSession);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const chunkPath = path.join(uploadDir, `${Date.now()}.webm`);

    fs.writeFile(chunkPath, data.chunk, async (err) => {
      if (err) {
        logger.error(`Error saving chunk: ${err.message}`);
        this.io.to(recordingSession).emit(SocketEvents.ERROR, 'Error saving chunk');
      } else {
        logger.debug(`Chunk saved: ${chunkPath}`);
        if (data.isLastChunk) {
          try {
            const file = await combineChunks(recordingSession);
            const mp4 = await convertToMp4(file, recordingSession);
            this.io.to(recordingSession).emit(SocketEvents.FINISHED_STREAMING, mp4);
          } catch (error) {
            logger.error('Error processing recording');
            this.io.to(recordingSession).emit(SocketEvents.ERROR, 'Error processing recording');
          }
        }
      }
    });
  }
}

export default SocketIOService;
