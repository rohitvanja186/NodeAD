const { renderCreateBlog, createBlog, allBlog, singleBlog, deleteBlog, renderEditBlog, editBlog } = require("../controller/blog/blogController");

const router = require("express").Router()

// kohi createBlog ma gayo vaney k garney vaneko ho 
 
router.route("/").get(allBlog)

router.route("/createBlog").get(renderCreateBlog).post(createBlog)

router.route("/single/:id").get(singleBlog)

router.route("/delete/:id").get(deleteBlog)

router.route("/edit/:id").get(renderEditBlog)

router.route("/editBlog/:id").post(editBlog)


module.exports = router;