import path from "path";
import express, { Request, Response, Router } from "express";
import multer, { FileFilterCallback } from "multer";

// Define custom interfaces for type safety
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Define upload destination type
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const router: Router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    cb(null, "uploads/");
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    const extname: string = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

// Configure file filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const filetypes: RegExp = /jpe?g|png|webp/;
  const mimetypes: RegExp = /image\/jpe?g|image\/png|image\/webp/;

  const extname: string = path.extname(file.originalname).toLowerCase();
  const mimetype: string = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"));
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// Define response interfaces
interface SuccessResponse {
  message: string;
  image: string;
}

interface ErrorResponse {
  message: string;
}

router.post("/", (req: MulterRequest, res: Response) => {
  uploadSingleImage(req, res, (err: any) => {
    if (err) {
      const response: ErrorResponse = { message: err.message };
      res.status(400).json(response);
    } else if (req.file) {
      const fullImagePath = path.join(__dirname, 'uploads', req.file.filename);
      const response: SuccessResponse = {
        message: "Image uploaded successfully",
        image: `/uploads/${req.file.filename}`, // Assuming your frontend fetches images from the root
      };
      res.status(200).json(response);
    } else {
      const response: ErrorResponse = { message: "No image file provided" };
      res.status(400).json(response);
    }
  });
});

export default router;