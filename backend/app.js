import express from 'express';
import authRoutes from './routes/authRoute.js';
import cors from 'cors'
const app = express();

app.use(cors())
app.use(express.json()); 

//TEST ROUTE 1
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Hello from Serverless Express (Vendia) ES6 Backend!'
  });
});

//TEST ROUTE 2
app.get('/api/users/:id', (req, res) => {
    res.json({ 
        userId: req.params.id, 
        source: 'Vendia Serverless Express'
    });
});

//mounting routes
app.use('/api/v1',authRoutes)


// IMPORTANT: Export the Express app instance
export default app;


