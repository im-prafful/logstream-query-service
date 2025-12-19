import express from 'express';
import authRoutes from './routes/authRoute.js';
import dashboardDisplayRoutes from './routes/dashboardDispRoute.js'
import cors from 'cors'
const app = express();

// --- EXPLICIT CORS CONFIGURATION ---
const corsOptions = {
    // 1. Specify the exact origin of your frontend application
    origin: 'http://localhost:5173', 
    
    // 2. Allow all necessary methods and headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // IMPORTANT: Allows cookies, authorization headers, etc.
    
    // 3. Ensure a successful status for the OPTIONS (preflight) request
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


