const multer = require('multer');
const path =  require('path')
// Upload File using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + ext)
    }
})

const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only .png and .jpeg formats are allowed!'), false); // Reject file
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload