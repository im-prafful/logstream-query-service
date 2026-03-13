import query from "../dbConnector.js";


export const viewIncidents = (req, res) => {
    return res.status(200).json({ message: 'incidents fetched successfully' });
};


export const createIncident = async (req, res) => {
    try {
        const { cluster_id, assigned_role, assigned_to } = req.body;

        await query(`
            INSERT INTO incidents (cluster_id, assigned_role, assigned_to)
            VALUES (${cluster_id}, '${assigned_role}', '${assigned_to}')
        `);

        return res.status(201).json({
            message: "incident created successfully"
        });

    } catch (err) {
        console.error("Error creating incident:", err);

        return res.status(500).json({
            message: "failed to create incident"
        });
    }
};


export const deleteIncident = (req, res) => {
    return res.status(200).json({ message: 'incident deleted successfully' });
};