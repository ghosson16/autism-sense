const axios = require('axios');

const generateSuggestion = async (req, res) => {
    const { conversationContext, emotion } = req.body;

    if (!conversationContext || !emotion) {
        return res.status(400).json({ error: 'Missing conversation context or emotion' });
    }

    try {
        const prompt = `The conversation is: "${conversationContext}". The other person's current facial expression is "${emotion}". Respond in 3 words or less.`;

        // Use the chat API endpoint for chat-based models
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',  // Ensure you're using a chat-based model
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Respond with short and simple phrases suitable for children with autism.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 10,  // Limiting tokens to ensure a short response
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        const suggestion = response.data.choices[0].message.content.trim();

        // Ensure the response is limited to 3 words
        const limitedSuggestion = suggestion.split(' ').slice(0, 3).join(' ');

        res.status(200).json({ suggestion: limitedSuggestion });
    } catch (error) {
        console.error('Error generating response:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error generating response' });
    }
};

module.exports = { generateSuggestion };