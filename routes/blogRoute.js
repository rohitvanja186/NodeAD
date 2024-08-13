const { renderCreateBlog, createBlog, allBlog, singleBlog, deleteBlog, renderEditBlog, editBlog, renderMyBlogs } = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = require("express").Router()

// kohi createBlog ma gayo vaney k garney vaneko ho 
 
router.route("/").get(allBlog)
router.route("/createBlog").get(renderCreateBlog).post(isAuthenticated, createBlog)
router.route("/single/:id").get(singleBlog)
router.route("/delete/:id").get(isAuthenticated, deleteBlog)
router.route("/edit/:id").get(isAuthenticated, renderEditBlog)
router.route("/editBlog/:id").post(isAuthenticated, editBlog)
router.route("/myBlogs").get(isAuthenticated, renderMyBlogs)


module.exports = router;