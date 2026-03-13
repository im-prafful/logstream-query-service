import query from "../dbConnector.js";
import redisclient from "../caching/redisClient.js";

export const viewIncidents = async (req, res) => {
    try {

        // role comes from JWT
        const role = req.user.role;

        const cacheKey = `incsByRole:${role}`;

        // check redis cache
        const cachedData = await redisclient.get(cacheKey);

        if (cachedData) {
            const incidents = JSON.parse(cachedData);

            return res.status(200).json({
                message: "incidents fetched successfully (cache)",
                incidents
            });
        }

        // fetch from database if cache miss
        const results = await query(`
            SELECT *
            FROM incidents
            WHERE assigned_role='${role}'
            ORDER BY created_at DESC
        `);

        // store in redis for 10 minutes
        await redisclient.setEx(
            cacheKey,
            600,
            JSON.stringify(results.rows)
        );

        return res.status(200).json({
            message: "incidents fetched successfully (db)",
            incidents: results.rows
        });

    } catch (err) {
        console.error("Error fetching incident:", err);

        return res.status(500).json({
            message: "failed to fetch incident"
        });
    }
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
