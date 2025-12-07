import express from "express";
import query from "../dbConnector.js";

//count of logs in last session
//count of individual level
//alertign service critical logs-----(FOR LATER)
export const displayDashboard = async () => {
  const result = await query(
    `SELECT count(*) FROM logs GROUP BY timestamp order by timestamp limit 1`
  );
};
