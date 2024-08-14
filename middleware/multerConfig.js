const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // mo need to do this code if the file type is already handled in frontend
        // logic to validate the fileType(mimeType)
        const allowedFileTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
            'image/webp',
            'image/bmp',
            'image/svg+xml',
            'image/tiff'
        ]

        // Validate the file type
        if (!allowedFileTypes.includes(file.mimetype)) {
            cb(new Error("Invalid file type")); // Reject the file
            return;
        }

        cb(null, "./uploads/"); // Proceed with storing the file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

module.exports = {
    multer,
    storage,
}