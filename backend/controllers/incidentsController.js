import query from "../dbConnector.js";
import redisclient from "../caching/redisClient.js";

export const viewIncidents = async (req, res) => {
  try {
    const role = String(req.user?.role || "").toUpperCase();
    const cacheKey = `incsByRole:${role}`;

    const cachedData = await redisclient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "incidents fetched successfully (cache)",
        incidents: JSON.parse(cachedData)
      });
    }

    //this query automatically shows all incs acc to user role but irrespective of user     (ex all dev incs will show  all sre will show... )        but need to implement incs in particular users bucket. 
    const results = await query(`
      SELECT *
      FROM incidents
      WHERE assigned_role='${role}'
      ORDER BY created_at DESC
    `);

    await redisclient.setEx(cacheKey, 1000, JSON.stringify(results.rows));

    return res.status(200).json({
      message: "incidents fetched successfully (db)",
      incidents: results.rows
    });
  } catch (err) {
    console.error("Error fetching incident:", err);
    return res.status(500).json({ message: "failed to fetch incident" });
  }
};

export const viewIncidentById = async (req, res) => {
  try {
    const incidentId = String(req.params?.incident_id || "").trim();
    const role = String(req.user?.role || "").toUpperCase();
    if (!incidentId) {
      return res.status(400).json({ message: "incident_id route param is required and must be a valid UUID" });
    }

    const result = await query(`
      SELECT *
      FROM incidents
      WHERE incident_id='${incidentId}'
      AND assigned_role='${role}'
      LIMIT 1
    `);

    if (!result?.rows?.length) {
      return res.status(404).json({ message: "incident not found" });
    }

    return res.status(200).json({
      message: "incident fetched successfully",
      incident: result.rows[0]
    });
  } catch (err) {
    console.error("Error fetching incident by id:", err);
    return res.status(500).json({ message: "failed to fetch incident" });
  }
};



export const createIncident = async (req, res) => {
    try {
        let { cluster_id, assigned_role, assigned_to } = req.body;
        assigned_role = String(assigned_role || "").trim().toUpperCase();

        if (!cluster_id || !assigned_role || !assigned_to) {
            return res.status(400).json({ message: "cluster_id, assigned_role and assigned_to are required" });
        }

        await query(`
            INSERT INTO incidents (cluster_id, assigned_role, assigned_to)
            VALUES (${cluster_id}, UPPER('${assigned_role}'), '${assigned_to}')
        `);

        // Invalidate cache so next read reflects fresh DB data
        await redisclient.del(`incsByRole:${assigned_role}`);

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


