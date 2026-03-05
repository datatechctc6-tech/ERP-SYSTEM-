const zoneService = require('../services/zone.service');

exports.createZone = async (req, res) => {
    try {
        const { ZONE_NAME } = req.body;

        if (!ZONE_NAME) {
            return res.status(400).json({ error: 'ZONE_NAME is required' });
        }

        const result = await zoneService.createZone(req.body);

        res.status(201).json({
            message: 'Zone created successfully',
            zone_code: result.ZONE_CODE,
            sl_no: result.SL_NO
        });
    } catch (error) {
        if (error.message === 'Zone name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error creating zone:', error);
        res.status(500).json({ error: 'Internal server error while creating zone' });
    }
};

exports.getZones = async (req, res) => {
    try {
        const zones = await zoneService.getZones();
        res.status(200).json(zones);
    } catch (error) {
        console.error('Error fetching zones:', error);
        res.status(500).json({ error: 'Internal server error while fetching zones' });
    }
};

exports.updateZone = async (req, res) => {
    try {
        const { id } = req.params;
        const { ZONE_NAME } = req.body;

        if (!ZONE_NAME) {
            return res.status(400).json({ error: 'ZONE_NAME is required' });
        }

        const updated = await zoneService.updateZone(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: 'Zone not found' });
        }

        res.status(200).json({ message: 'Zone updated successfully' });
    } catch (error) {
        if (error.message === 'Zone name already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Error updating zone:', error);
        res.status(500).json({ error: 'Internal server error while updating zone' });
    }
};

exports.deleteZone = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await zoneService.deleteZone(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Zone not found' });
        }

        res.status(200).json({ message: 'Zone deleted successfully' });
    } catch (error) {
        console.error('Error deleting zone:', error);
        res.status(500).json({ error: 'Internal server error while deleting zone' });
    }
};
