const multer = require("multer");
const path = require("path");

// Multer configuration for single image upload
const singleUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/avatars");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      const filename = file.fieldname + "-" + uniqueSuffix + extension;
      const filePath = path.join("uploads", "avatars", filename);
      req.filePath = path.normalize(filePath); // Normalize the file path to remove double slashes
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).single("avatar");


//Logo Upload 
const logoUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/logos");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      const filename = file.fieldname + "-" + uniqueSuffix + extension;
      const filePath = path.join("uploads", "logos", filename);
      req.filePath = path.normalize(filePath); // Normalize the file path to remove double slashes
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).single("logo");

// Multer configuration for multiple image uploads
const multipleUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      const filePath =
        "uploads/" + file.fieldname + "-" + uniqueSuffix + extension;
      req.filePaths = req.filePaths || []; // Create an array to store file paths
      req.filePaths.push(path.join(filePath)); // Add full file path to the array
      cb(null, filePath);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).array("images", 5); // 'images' is the field name for the multiple image uploads, allowing up to 5 images

module.exports = {
  singleUpload,
  multipleUpload,
  logoUpload,
};
