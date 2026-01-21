import express from'express'
import query from '../dbConnector.js'

export const getDashboardLogs = async (req, res) => {
    try {
        const { level } = req.body; // Needed for the filtered logs based on category

        // 1. Fetch latest log date and count
        const results = await query(`
            WITH extracted_date AS (
              SELECT "timestamp"::date AS log_date
              FROM logs
            )
            SELECT 
                log_date, 
                COUNT(*) AS total_count
            FROM extracted_date 
            GROUP BY log_date 
            ORDER BY log_date DESC
            LIMIT 1;
        `);

        // Check if DB is empty as per your original logic
        if (results.rows.length === 0) {
            return res.status(501).json({ message: 'no new logs from DB' });
        }

        const logCount = results.rows[0].total_count;
        let temp = logCount < 5 ? logCount : 5;

        // 2. Fetch both the recent logs and the level-specific logs in parallel
        const [recentLogs, filteredLogs,logs_per_category,logs_per_cluster] = await Promise.all([
            query(`SELECT * FROM logs ORDER BY timestamp DESC LIMIT ${temp}`),
            query(`SELECT * FROM logs WHERE level='${level}' ORDER BY timestamp DESC LIMIT 30`),
            query(`SELECT COUNT(*) as tc, level as lvl FROM logs GROUP BY level order by tc desc`),
                        //Logs per cluster for latest DATE
            query(`
      WITH t AS (
        SELECT DATE(timestamp) AS latest_date
        FROM logs
        ORDER BY timestamp DESC
        LIMIT 1
      )
      SELECT
        l.cluster_id,
        COUNT(*) AS total_logs_per_cluster
      FROM logs l
      JOIN t
        ON DATE(l.timestamp) = t.latest_date
      WHERE l.level IN ('error','warning')
      GROUP BY l.cluster_id
    `)
        ]);

        // 3. Send all data as a single response object
        return res.status(200).json({
            message: 'success',
            //res objects for top 5 most recent logs
            logCount: results.rows,       
            logs: recentLogs.rows,  
            
            //res objects for 30 fileterd rows based on category
            fetchedRows: filteredLogs.rows.length, 
            rows: filteredLogs.rows,
            
            //logs count per category
            logs_per_category:logs_per_category.rows,
            logs_per_cluster:logs_per_cluster.rows
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'failed to retrieve logs from DB' });
    }
};
