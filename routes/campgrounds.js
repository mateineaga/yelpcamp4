const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')  //se importa din controllers obiectul campgrounds, care are mai multe methods, gen index
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })        //se stocheaza in cloudinary

//router.route -> grupeaza mai multe rute comune

router.route('/')
    .get(catchAsync(campgrounds.index))  //apelare prescurtata din fisierul controllers a metodei index
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

// echivalent
// router.get('/', catchAsync(campgrounds.index))  
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;