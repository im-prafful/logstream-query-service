import query from '../dbConnector.js'

export const searchUsers = async (req, res) => {
    try {
        const q = req.query.q || "";
        
        const sql = `
            SELECT user_id, full_name, email, role 
            FROM users 
            WHERE full_name ILIKE '%${q}%' 
               OR email ILIKE '%${q}%'
            LIMIT 10
        `;

        const result = await query(sql);

        return res.status(200).json({
            message: 'success',
            users: result.rows
        });
    } catch (e) {
        console.error("Error searching users:", e);
        return res.status(500).json({ message: 'failed to search users' });
    }
};
