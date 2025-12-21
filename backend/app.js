import express from 'express';
import authRoutes from './routes/authRoute.js';
import dashboardDisplayRoutes from './routes/dashboardDispRoute.js'
import cors from 'cors'
const app = express();

/// --- EXPLICIT CORS CONFIGURATION ---
const corsOptions = {
  // 1. Allowed frontend origins
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],

  // 2. Allow required HTTP methods
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],

  // 3. Allow credentials (cookies, auth headers, etc.)
  credentials: true,

  // 4. Success status for preflight requests
  optionsSuccessStatus: 204
};


app.use(cors(corsOptions)); // Apply the explicit options
// -----------------------------------
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


// IMPORTANT: Export the Express app instance
export default app;


