const axios = require('axios');

const generateSuggestion = async (req, res) => {
    const { conversationContext } = req.body;

    if (!conversationContext ) {
        return res.status(400).json({ error: 'Missing conversation context' });
    }

    try {
        const prompt = `The conversation is: "${conversationContext}". Respond in 3 words or less.`;

        // Use the chat API endpoint for chat-based models
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Respond with short and simple phrases suitable for children with autism.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 10,
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
