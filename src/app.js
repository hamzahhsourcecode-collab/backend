import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middleware/error.js';

// Route files
import auth from './routes/auth.js';
import jobs from './routes/jobs.js';
import data from './routes/data.js';
import users from './routes/users.js';

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/jobs', jobs);
app.use('/api/v1/data', data);
app.use('/api/v1/users', users);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to China Apna Client API' });
});

// Error handler
app.use(errorHandler);

export default app;
