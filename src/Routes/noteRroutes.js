const express = require('express');
const NoteController = require('../controllers/noteController');
const multer = require('multer');
const router = express.Router();
const uuid = require("uuid");
const { verifyToken } = require('../middlewares/authMiddleware');

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.toLocaleLowerCase().split(' ').join('-');
    cb(null, uuid.v4() + filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only jpg, png and jpeg allowed."));
    }
  }
});

router.post('/note', [verifyToken, upload.single('image')], NoteController.createNote);
router.patch('/note', [verifyToken, upload.single('image')], NoteController.updateNote);
router.get('/note/:userId', [verifyToken], NoteController.getAllByUserId);
router.delete('/note', [verifyToken], NoteController.deleteNote);
router.patch('/note/update-status', [verifyToken], NoteController.changeNoteState);

module.exports = router;