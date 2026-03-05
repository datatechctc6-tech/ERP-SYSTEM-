const workService = require('../services/work.service');
const logActivity = require('../utils/activityLogger');


exports.createWork = async (req, res) => {
    try {
        const { WORK_NAME } = req.body;

        if (!WORK_NAME) {
            return res.status(400).json({ error: 'WORK_NAME is required' });
        }

        const result = await workService.createWork(req.body);

        res.status(201).json({
            message: 'Work created successfully',
            work_code: result.WORK_CODE,
            sl_no: result.SL_NO
        });
        logActivity(req, 'CREATE_WORK', `Created work: ${WORK_NAME}`);

    } catch (error) {
        if (error.message === 'Work name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error creating work:', error);
        res.status(500).json({ error: 'Internal server error while creating work' });
    }
};

exports.getWorks = async (req, res) => {
    try {
        const works = await workService.getWorks();
        res.status(200).json(works);
    } catch (error) {
        console.error('Error fetching works:', error);
        res.status(500).json({ error: 'Internal server error while fetching works' });
    }
};

exports.updateWork = async (req, res) => {
    try {
        const { id } = req.params;
        const { WORK_NAME } = req.body;

        if (!WORK_NAME) {
            return res.status(400).json({ error: 'WORK_NAME is required' });
        }

        const updated = await workService.updateWork(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: 'Work not found' });
        }

        res.status(200).json({ message: 'Work updated successfully' });
        logActivity(req, 'UPDATE_WORK', `Updated work ID: ${id} (${WORK_NAME})`);

    } catch (error) {
        if (error.message === 'Work name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error updating work:', error);
        res.status(500).json({ error: 'Internal server error while updating work' });
    }
};

exports.deleteWork = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await workService.deleteWork(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Work not found' });
        }

        res.status(200).json({ message: 'Work deleted successfully' });
        logActivity(req, 'DELETE_WORK', `Deleted work ID: ${id}`);

    } catch (error) {
        console.error('Error deleting work:', error);
        res.status(500).json({ error: 'Internal server error while deleting work' });
    }
};
