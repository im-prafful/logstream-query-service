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


export const updateIncById = async (req, res) => {
  try {

    const incidentId = String(req.params?.incident_id || "").trim();
    if (!incidentId) {
      return res.status(400).json({ message: "incident_id route param is required and must be a valid UUID" });
    }

    let { status, assigned_role, assigned_to } = req.body

    if (!status || !assigned_role || !assigned_to) {
      return res.status(400).json({
        message: "status, assigned_role and assigned_to are required"
      });
    }

    status = String(status || "").trim().toUpperCase();
    assigned_role = String(assigned_role || "").trim().toUpperCase();
    assigned_to = String(assigned_to || "").trim();

    await query(`
      UPDATE incidents
      SET 
        status='${status}', 
        assigned_role='${assigned_role}', 
        assigned_to='${assigned_to}',
        updated_at=NOW(),
        resolved_at = CASE WHEN '${status}' = 'RESOLVED' THEN NOW() ELSE NULL END
      WHERE incident_id='${incidentId}'
    `);

    await redisclient.del(`incsByRole:${assigned_role}`);

    return res.status(200).json({
      message: "incident updated successfully"
    });

  } catch (e) {
    console.error("Error updating incident:", e);
    return res.status(500).json({ message: "failed to update incident" });
  }
}

export const viewIncidentHistory = async (req, res) => {
  try {
    const incidentId = String(req.params?.incident_id || "").trim();
    if (!incidentId) {
      return res.status(400).json({ message: "incident_id route param is required" });
    }

    const result = await query(`
      SELECT history_id, incident_id, user_id, comment, old_value, new_value, changed_at
      FROM incident_history
      WHERE incident_id='${incidentId}'
      ORDER BY changed_at DESC
    `);

    return res.status(200).json({
      message: "history fetched successfully",
      history: result.rows
    });
  } catch (err) {
    console.error("Error fetching incident history:", err);
    return res.status(500).json({ message: "failed to fetch incident history" });
  }
};

export const updateHistory = async (req, res) => {
  try {

    let { incident_id, user_id, comment, old_value, new_value } = req.body
    if (!incident_id) {
      return res.status(400).json({ message: "incident_id route param is required and must be a valid UUID" });
    }

    if (!incident_id || !user_id || !old_value || !new_value || !comment) {
      return res.status(400).json({
        message: " incident_id, user_id, old_value, new_value and comment are required"
      });
    }

    incident_id = String(incident_id).trim();
    user_id = String(user_id).trim();
    old_value = String(old_value).trim().toUpperCase();
    new_value = String(new_value).trim().toUpperCase();
    comment = String(comment).trim();

    console.log(incident_id, user_id, comment, old_value, new_value)

    await query(`
      INSERT INTO incident_history (incident_id,user_id,comment,old_value,new_value)
      VALUES('${incident_id}', '${user_id}', '${comment}', '${old_value}', '${new_value}')
    `);

    await redisclient.del(`incsByRole:${old_value}`);//invalidate cache

    return res.status(200).json({
      message: "incident updated successfully"
    });

  } catch (e) {
    console.error("Error updating incident:", e);
    return res.status(500).json({ message: "failed to update incident" });
  }
}