const express = require('express');
let router = express.Router();
const {indexController} = require("../controllers/indexController")
/* GET home page. */
router.get('/', indexController);


module.exports = router;
