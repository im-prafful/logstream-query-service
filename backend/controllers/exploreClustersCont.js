import express from 'express'
import query from '../dbConnector.js'
import redisclient from '../caching/redisClient.js';

export const getLogsByClusterId = async (req, res) => {
    try {
        const { clusterId } = req.params;

        // Basic validation
        if (!clusterId) {
            return res.status(400).json({
                message: 'clusterId is required'
            });
        }

        const cachedData = await redisclient.get(`logsByClusterId:${clusterId}`);
        if (cachedData) {
            return res.status(200).json({
                message: 'success',
                logs: JSON.parse(cachedData)
            });
        }


        const result = await query(`
            WITH t AS (
            SELECT DATE(timestamp) AS log_date
            FROM logs
            ORDER BY timestamp DESC
            LIMIT 1
            )
            SELECT *
            FROM logs l
            JOIN t ON DATE(l.timestamp) = t.log_date
            WHERE cluster_id = ${clusterId}
            ORDER BY cluster_id
            LIMIT 10;
    `);

        await redisclient.setEx(`logsByClusterId:${clusterId}`, 120, JSON.stringify(result.rows));

        return res.status(200).json({
            message: 'Success',
            logs: result.rows
        });

    } catch (e) {
        console.error('getLogsByClusterId error:', e);

        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
