import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = formidable({
    multiples: false,
    maxFileSize: MAX_FILE_SIZE, // Set the maximum file size to 5GB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    if (!files.file) return res.status(400).json({ error: 'No file uploaded' });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const ext = path.extname(file.originalFilename || '') || '';
    const custom =
      fields.customName?.[0]?.replace(/[^a-zA-Z0-9-_]/g, '') || nanoid();
    const filename = `${custom}${ext}`;

    // Folder 'result' untuk menyimpan hasil upload
    const resultDir = path.join(process.cwd(), 'public', 'result');
    if (!fs.existsSync(resultDir)) fs.mkdirSync(resultDir, { recursive: true });

    const dest = path.join(resultDir, filename);
    await fs.promises.copyFile(file.filepath, dest);

    const url = `/result/${filename}`;
    res.status(200).json({ url });
  });
}
