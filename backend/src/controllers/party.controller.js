const partyService = require('../services/party.service');

exports.createParty = async (req, res) => {
    try {
        const { FULL_NAME, PHONE, PINCODE, EMAIL_ID } = req.body;

        if (!FULL_NAME || !PHONE || !PINCODE || !EMAIL_ID) {
            return res.status(400).json({ error: 'FULL_NAME, PHONE, PINCODE and EMAIL_ID are required' });
        }

        const result = await partyService.createParty(req.body);

        res.status(201).json({
            message: 'Party/Holder created successfully',
            hold_code: result.hold_code,
            sl_no: result.sl_no
        });
    } catch (error) {
        console.error('Error saving party data:', error);
        res.status(500).json({ error: 'Internal server error while saving party data' });
    }
};

exports.getParties = async (req, res) => {
    try {
        const parties = await partyService.getParties();
        res.status(200).json(parties);
    } catch (error) {
        console.error('Error fetching parties:', error);
        res.status(500).json({ error: 'Internal server error while fetching parties' });
    }
};

exports.updateParty = async (req, res) => {
    try {
        const { id } = req.params;
        const { FULL_NAME, PHONE, EMAIL_ID } = req.body;

        if (!FULL_NAME || !PHONE || !EMAIL_ID) {
            return res.status(400).json({ error: 'FULL_NAME, PHONE, and EMAIL_ID are required' });
        }

        const updated = await partyService.updateParty(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: 'Party not found' });
        }

        res.status(200).json({ message: 'Party updated successfully' });
    } catch (error) {
        console.error('Error updating party:', error);
        res.status(500).json({ error: 'Internal server error while updating party' });
    }
};

exports.deleteParty = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await partyService.deleteParty(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Party not found' });
        }

        res.status(200).json({ message: 'Party deleted successfully' });
    } catch (error) {
        console.error('Error deleting party:', error);
        res.status(500).json({ error: 'Internal server error while deleting party' });
    }
};
