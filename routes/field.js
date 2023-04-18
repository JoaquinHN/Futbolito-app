const express = require('express')
const router = express.Router()
const fieldController = require('../controllers/fieldController')

router.post('/',fieldController.createField)
router.delete('/',fieldController.deleteField)
router.post('/:id',fieldController.createField)
router.get('/:id',fieldController.getFieldById)
router.get('/',fieldController.getFields)
router.put('/:id',fieldController.updateField)

module.exports = router