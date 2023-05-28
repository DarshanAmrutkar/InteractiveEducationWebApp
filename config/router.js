const express = require("express");
const router = express();
const notesController = require("../controllers/notesController");
const categoryController = require("../controllers/categoryController");


const  fetchuser  = require("../middleware/fetchuser");

router.get("/notes", fetchuser, notesController.list);
router.get("/notes/:id", fetchuser, notesController.show);
router.post("/notes", fetchuser, notesController.create);
router.put("/notes/:id", fetchuser, notesController.update);
router.delete("/notes/:id", fetchuser, notesController.destroy);

router.get("/category", fetchuser, categoryController.list);
router.get("/category/:id", fetchuser, categoryController.show);
router.post("/category", fetchuser, categoryController.create);
router.put("/category/:id", fetchuser, categoryController.update);
router.delete("/category/:id", fetchuser, categoryController.destroy);




module.exports = router;