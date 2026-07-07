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

        const cachedData = await redisclient.get(`logsByClusterIdV2:${clusterId}`);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return res.status(200).json({
                message: 'success',
                logs: parsed.logs,
                chartData: parsed.chartData
            });
        }

        const [logsResult, chartResult] = await Promise.all([
            query(`
                SELECT *
                FROM logs
                WHERE cluster_id = ${clusterId}
                ORDER BY timestamp DESC
                LIMIT 5;
            `),
            query(`
                SELECT 
                    DATE(timestamp) as date, 
                    COUNT(*) as count
                FROM logs
                WHERE cluster_id = ${clusterId}
                GROUP BY DATE(timestamp)
                ORDER BY date ASC;
            `)
        ]);


        const responseData = {
            logs: logsResult.rows,
            chartData: chartResult.rows
        };

        await redisclient.setEx(`logsByClusterIdV2:${clusterId}`, 120, JSON.stringify(responseData));

        return res.status(200).json({
            message: 'Success',
            logs: responseData.logs,
            chartData: responseData.chartData
        });

    } catch (e) {
        console.error('getLogsByClusterId error:', e);

        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
