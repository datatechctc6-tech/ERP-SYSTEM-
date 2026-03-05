const departmentService = require('../services/department.service');
const logActivity = require('../utils/activityLogger');


exports.createDepartment = async (req, res) => {
    try {
        const { DEPT_NAME } = req.body;

        if (!DEPT_NAME) {
            return res.status(400).json({ error: 'DEPT_NAME is required' });
        }

        const result = await departmentService.createDepartment(req.body);

        res.status(201).json({
            message: 'Department created successfully',
            dept_code: result.DEPT_CODE,
            sl_no: result.SL_NO
        });
        logActivity(req, 'CREATE_DEPT', `Created department: ${DEPT_NAME}`);

    } catch (error) {
        if (error.message === 'Department name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error creating department:', error);
        res.status(500).json({ error: 'Internal server error while creating department' });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getDepartments();
        res.status(200).json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Internal server error while fetching departments' });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        // Here, id maps to SL_NO as per routing /api/department/:id
        const { id } = req.params;
        const { DEPT_NAME } = req.body;

        if (!DEPT_NAME) {
            return res.status(400).json({ error: 'DEPT_NAME is required' });
        }

        const updated = await departmentService.updateDepartment(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.status(200).json({ message: 'Department updated successfully' });
        logActivity(req, 'UPDATE_DEPT', `Updated department ID: ${id} (${DEPT_NAME})`);

    } catch (error) {
        if (error.message === 'Department name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error updating department:', error);
        res.status(500).json({ error: 'Internal server error while updating department' });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await departmentService.deleteDepartment(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.status(200).json({ message: 'Department deleted successfully' });
        logActivity(req, 'DELETE_DEPT', `Deleted department ID: ${id}`);

    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ error: 'Internal server error while deleting department' });
    }
};
