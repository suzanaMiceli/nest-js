import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File, path: string) {
    const savedFile = await writeFile(path, file.buffer);
    return savedFile;
  }
}
