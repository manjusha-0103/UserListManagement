const express = require("express")

const {
  addConstomFields,
    handleCsvFile,
    umsubscribesdUser,
    sendBulkmails
} = require("../controllers/userListManagerController")

const multer = require("multer")

const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

const userstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: userstorage,
    fileFilter: csvFilter
})


const router = express.Router()

router.post("/addCustomFields",addConstomFields);
router.post("/addCsv/:listid",upload.single("file"),handleCsvFile);
router.get("/unsubscribes/:userid",umsubscribesdUser)
router.post("/sendBulkEmail", sendBulkmails)

module.exports = router