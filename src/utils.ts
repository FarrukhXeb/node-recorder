import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import logger from '@/lib/logger';

export async function combineChunks(recordingSession: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'src', 'uploads', recordingSession);
  const outputDir = path.join(process.cwd(), 'src', 'output');
  const combinedWebmPath = path.join(outputDir, `${recordingSession}.webm`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Get all WebM chunks and sort them by name (which should be timestamp)
    const chunkList = fs
      .readdirSync(uploadDir)
      .filter((file) => file.endsWith('.webm'))
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((file) => path.join(uploadDir, file));

    // Combine chunks
    const writer = fs.createWriteStream(combinedWebmPath);
    for (const chunkPath of chunkList) {
      const chunkData = fs.readFileSync(chunkPath);
      writer.write(chunkData);
    }
    writer.end();

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    logger.info(`Chunks combined: ${combinedWebmPath}`);

    // Clean up temporary files
    chunkList.forEach((chunk) => fs.unlinkSync(chunk));
    fs.rmdirSync(uploadDir);

    return combinedWebmPath;
  } catch (error) {
    logger.error('Error combining chunks:', error);
    throw error;
  }
}

export async function convertToMp4(file: string, recordingSession: string): Promise<string> {
  const execPromise = util.promisify(exec);
  const outputDir = path.join(process.cwd(), 'src', 'output');
  const outputMp4Path = path.join(outputDir, `${recordingSession}.mp4`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    await execPromise(`ffmpeg -i ${file} -c:v libx264 -crf 23 -c:a aac -q:a 100 ${outputMp4Path}`);
    fs.unlinkSync(file);
    logger.info(`Conversion complete: ${outputMp4Path}`);
    return outputMp4Path;
  } catch (error) {
    logger.error('Error converting to MP4:', error);
    throw error;
  }
}
