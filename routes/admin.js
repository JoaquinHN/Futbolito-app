const express = require('express')
const router = express.Router()

router.post('/',adminController.adminData)

module.exports = router