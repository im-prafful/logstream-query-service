import express from 'express'
import query from '../dbConnector.js'

export const getDashboardLogs = async (req, res) => {
    try {

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
        const [recentLogs, logs_per_category, logs_per_cluster] = await Promise.all([
            query(`SELECT * FROM logs ORDER BY timestamp DESC LIMIT ${temp}`),
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

            //logs count per category
            logs_per_category: logs_per_category.rows,

            //log count per cluster
            logs_per_cluster: logs_per_cluster.rows
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'failed to retrieve logs from DB' });
    }
};


export const getFilteredLogs = async (req, res) => {
    const { payload } = req.body

    if (!payload) {
        return res.status(400).json({
            message: 'Invalid payload'
        })
    }

    try {
        let result

        // only level
        if (payload.lvl && !payload.timestamp) {
            result = await query(
                `select * from logs where level='${payload.lvl}' order by timestamp desc limit 20`
            )
        }

        // level + timestamp
        else if (payload.lvl && payload.timestamp) {
            result = await query(
                `select * from logs 
                 where level='${payload.lvl}' 
                 and timestamp >= now() - interval '${payload.timestamp} days'
                 order by timestamp desc 
                 limit 20`
            )
        }

        // only timestamp
        else if (!payload.lvl && payload.timestamp) {
            result = await query(
                `select * from logs 
                 where timestamp >= now() - interval '${payload.timestamp} days'
                 order by timestamp desc 
                 limit 20`
            )
        }

        if (!result.rows || result.rows.length === 0) {
            return res.status(200).json({
                message: `No logs found in the last ${payload.timestamp} days`,
                logs: []
            })
        }

        return res.status(200).json({
            message: 'Success',
            logs: result.rows
        })
    } catch (e) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}
