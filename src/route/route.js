const express = require('express');
const router = express.Router();

/**************************************IMPORTING CONTACT CONTROLLER************************************** */
const contactController = require("../controller/contactController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


/********************************************CONTACT API'S********************************************* */

router.post("/createContact", contactController.createContact)
router.delete("/deleteContact", contactController.deleteContact)
router.get("/fetchAllContact", contactController.fetchAllContact)
router.get("/fetchAllDeletedContact", contactController.fetchAllDeletedContact)
router.get("/searchContact", contactController.searchContact)
router.put("/updateContact", contactController.updateContact)

module.exports= router;