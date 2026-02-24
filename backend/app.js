import express, { application } from 'express';
import authRoutes from './routes/authRoute.js';
import dashboardDisplayRoutes from './routes/dashboardDispRoute.js'
import exploreClustersRoutes from './routes/exploreClusterRoute.js'
import permissionsRoute from './routes/permissionsRoute.js'
import cors from 'cors'
const app = express();

app.use(express.json()); 

//TEST ROUTE 1
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Hello from Serverless Express (Vendia) ES6 Backend!'
  });
});


//mounting routes
app.use('/api/v1',authRoutes)
app.use('/api/v1',dashboardDisplayRoutes)
app.use('/api/v1',exploreClustersRoutes)
app.use('/api/v1',permissionsRoute)


// IMPORTANT: Export the Express app instance
export default app;


