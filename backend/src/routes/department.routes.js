const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/department', verifyToken, departmentController.createDepartment);
router.get('/departments', verifyToken, departmentController.getDepartments);
router.put('/department/:id', verifyToken, departmentController.updateDepartment);
router.delete('/department/:id', verifyToken, departmentController.deleteDepartment);

module.exports = router;
