const { renderCreateBlog, createBlog, allBlog, singleBlog, deleteBlog, renderEditBlog, editBlog, renderMyBlogs } = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = require("express").Router()

const { multer, storage } = require("../middleware/multerConfig");
const { isValidUser } = require("../middleware/validUser");
const upload = multer({ storage: storage});

// kohi createBlog ma gayo vaney k garney vaneko ho 
 
router.route("/").get(allBlog)
router.route("/createBlog").get(isAuthenticated, renderCreateBlog).post(isAuthenticated, upload.single('image'),  createBlog)
router.route("/single/:id").get(singleBlog)
router.route("/delete/:id").get(isAuthenticated, isValidUser, deleteBlog)
router.route("/edit/:id").get(isAuthenticated, renderEditBlog)
router.route("/editBlog/:id").post(isAuthenticated, isValidUser, upload.single('image'), editBlog)
router.route("/myBlogs").get(isAuthenticated, renderMyBlogs)


module.exports = router;