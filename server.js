import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { default as fetch } from 'node-fetch';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/generate-description', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 400,
                n: 1,
                stop: null,
                temperature: 0.8,
            }),
        });

        const data = await response.json();
        console.log(data); // Log de depura��o
        res.json(data.choices[0].text);
    } catch (error) {
        console.error('Error fetching ChatGPT API:', error);
        res.status(500).json({ error: 'Failed to fetch ChatGPT API' });
    }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
