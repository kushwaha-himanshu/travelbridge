import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      let uploadDir;

      console.log("MIME TYPE:", file.mimetype);

      // Images
      if (file.mimetype.startsWith("image/")) {
        uploadDir = path.join(process.cwd(), "uploads", "image");
      }

      // Audio files + WhatsApp audio recordings
      else if (
        file.mimetype.startsWith("audio/") ||
        file.mimetype === "video/mp4"
      ) {
        uploadDir = path.join(process.cwd(), "uploads", "audio");
      }

      // Unsupported files
      else {
        return cb(
          new Error(`Unsupported file type: ${file.mimetype}`),
          false
        );
      }

      // Create folder if not exists
      fs.mkdirSync(uploadDir, { recursive: true });

      cb(null, uploadDir);
    } catch (error) {
      cb(error, false);
    }
  },

  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

export default upload;