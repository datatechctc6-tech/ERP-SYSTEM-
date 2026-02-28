const partyService = require("../services/party.service");

exports.searchGPs = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    if (!keyword.trim()) {
      return res.status(200).json([]);
    }
    const data = await partyService.searchGPs(keyword);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error searching GPs:", error);
    res
      .status(500)
      .json({ error: "Internal server error while searching GPs" });
  }
};

exports.getGPById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await partyService.getGPById(id);
    if (!data) return res.status(404).json({ error: "GP not found" });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching GP:", error);
    res.status(500).json({ error: "Internal server error while fetching GP" });
  }
};

exports.createParty = async (req, res) => {
  try {
    const { FULL_NAME, PHONE, PINCODE, EMAIL_ID } = req.body;

    if (!FULL_NAME || !PHONE || !PINCODE || !EMAIL_ID) {
      return res
        .status(400)
        .json({ error: "FULL_NAME, PHONE, PINCODE and EMAIL_ID are required" });
    }

    const partyData = { ...req.body };
    if (req.file) {
      partyData.photo = `/uploads/gpholdms/${req.file.filename}`;
    }

    const result = await partyService.createParty(partyData);

    res.status(201).json({
      message: "Party/Holder created successfully",
      hold_code: result.hold_code,
      sl_no: result.sl_no,
    });
  } catch (error) {
    console.error("Error saving party data:", error);
    res
      .status(500)
      .json({ error: "Internal server error while saving party data" });
  }
};

exports.getParties = async (req, res) => {
  try {
    const parties = await partyService.getParties();
    res.status(200).json(parties);
  } catch (error) {
    console.error("Error fetching parties:", error);
    res
      .status(500)
      .json({ error: "Internal server error while fetching parties" });
  }
};

exports.updateParty = async (req, res) => {
  try {
    const { id } = req.params;
    const { FULL_NAME, PHONE, EMAIL_ID, PINCODE } = req.body;

    if (!FULL_NAME || !PHONE || !EMAIL_ID) {
      return res
        .status(400)
        .json({ error: "FULL_NAME, PHONE, and EMAIL_ID are required" });
    }

    const partyData = { ...req.body };
    if (req.file) {
      partyData.photo = `/uploads/gpholdms/${req.file.filename}`;
    }

    const updated = await partyService.updateParty(id, partyData);

    if (!updated) {
      return res.status(404).json({ error: "Party not found" });
    }

    res.status(200).json({ message: "Party updated successfully" });
  } catch (error) {
    console.error("Error updating party:", error);
    res
      .status(500)
      .json({ error: "Internal server error while updating party" });
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await partyService.deleteParty(id);

    if (!deleted) {
      return res.status(404).json({ error: "Party not found" });
    }

    res.status(200).json({ message: "Party deleted successfully" });
  } catch (error) {
    console.error("Error deleting party:", error);
    res
      .status(500)
      .json({ error: "Internal server error while deleting party" });
  }
};
