const multer = require('multer');
const path =  require('path')
// Upload File using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        console.log(file,"filess")
        const ext = path.extname(file.originalname);
        const fileName = file.originalname.split('.')[0];
        cb(null, fileName + ext)
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