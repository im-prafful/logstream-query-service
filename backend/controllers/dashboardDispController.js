import express from'express'
import query from '../dbConnector.js'

export const displayLogs=async(req,res)=>{
    try{
        // Query the logs table to find the latest log date (by timestamp) 
        // and count how many logs were inserted on that specific date.

        const results=await query(`
            WITH extracted_date AS (
              SELECT "timestamp"::date AS log_date  -- 1. Give the extracted date a column alias
              FROM logs
            )

            SELECT 
            log_date,         -- 2. Select the date column
            COUNT(*) AS total_count
            FROM extracted_date 
            GROUP BY log_date -- 3. Group by the correct column alias
            order by log_date desc
            limit 1;   
        `)


        if (results.rows.length===0){
             return res.status(501).json({ message: 'no new logs from DB' });
        }

        const logCount=results.rows[0].total_count

        let temp=logCount<5? logCount :5 //--fetch deatils of 5 logs to display in frontend  if 5<logCount as logcount can be very large(>1000) or fetch details of logCount itself if logCount<5   ...simple stuff!!

        const details=await query(`SELECT * FROM logs ORDER BY timestamp desc limit ${temp}`)
        
        return res.status(200).json({
            message:'success',
            logCount:results.rows,
            logs:details.rows
        })

    }catch(e){
        console.log(e)
        return res.status(500).json({ message: 'failed to retreive logs from DB' });
    }
}