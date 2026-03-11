import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// load .env for local development (GEMINI_API_KEY)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set.');
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/api/chat', async(req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'prompt missing' });
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ text });
    } catch (err) {
        console.error('server error calling Gemini API', err);
        res.status(500).json({ error: err.message || 'unknown error' });
    }
});

// simple health check
app.get('/api/health', (_req, res) => {
    res.send('ok');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Gemini proxy server listening on http://localhost:${port}`);
});