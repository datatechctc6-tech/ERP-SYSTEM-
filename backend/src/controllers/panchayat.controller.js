const panchayatService = require('../services/panchayat.service');

exports.createPanchayat = async (req, res) => {
    try {
        const { PANCHAYAT_NAME } = req.body;

        if (!PANCHAYAT_NAME) {
            return res.status(400).json({ error: 'PANCHAYAT_NAME is required' });
        }

        const result = await panchayatService.createPanchayat(req.body);

        res.status(201).json({
            message: 'Panchayat created successfully',
            panchayat_code: result.PANCHAYAT_CODE,
            sl_no: result.SL_NO
        });
    } catch (error) {
        if (error.message === 'Panchayat name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error creating panchayat:', error);
        res.status(500).json({ error: 'Internal server error while creating panchayat' });
    }
};

exports.getPanchayats = async (req, res) => {
    try {
        const panchayats = await panchayatService.getPanchayats();
        res.status(200).json(panchayats);
    } catch (error) {
        console.error('Error fetching panchayats:', error);
        res.status(500).json({ error: 'Internal server error while fetching panchayats' });
    }
};

exports.updatePanchayat = async (req, res) => {
    try {
        const { id } = req.params;
        const { PANCHAYAT_NAME } = req.body;

        if (!PANCHAYAT_NAME) {
            return res.status(400).json({ error: 'PANCHAYAT_NAME is required' });
        }

        const updated = await panchayatService.updatePanchayat(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: 'Panchayat not found' });
        }

        res.status(200).json({ message: 'Panchayat updated successfully' });
    } catch (error) {
        if (error.message === 'Panchayat name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error updating panchayat:', error);
        res.status(500).json({ error: 'Internal server error while updating panchayat' });
    }
};

exports.deletePanchayat = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await panchayatService.deletePanchayat(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Panchayat not found' });
        }

        res.status(200).json({ message: 'Panchayat deleted successfully' });
    } catch (error) {
        console.error('Error deleting panchayat:', error);
        res.status(500).json({ error: 'Internal server error while deleting panchayat' });
    }
};
