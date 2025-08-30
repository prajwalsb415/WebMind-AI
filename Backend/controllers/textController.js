import together from '../config/togetherClient.js';

export const improveText = async (req, res) => {
  try {
    const { text, category } = req.body;
    console.log('Received request with:', {
      textLength: text?.length,
      category: category || 'none'
    });

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (!process.env.TOGETHER_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      messages: [
        {
          role: "system",
          content: `You are a professional web content writer specializing in ${category || 'website'} pages. Improve the given text to be more engaging, professional, and structured for a web page. Do not include any commentary or <think> tags. Output ONLY the improved text.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    let improvedText = response.choices[0].message.content;
    // Remove any <think> tags and unwanted special characters
    improvedText = improvedText
      .replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '')
      .replace(/[^\w\s.,?!'"-]/g, '')
      .trim();

    console.log('Successfully improved text');
    res.json({ improvedText });
  } catch (error) {
    console.error('Error in improveText:', error.message);
    res.status(500).json({ error: 'Failed to improve text', details: error.message });
  }
};

export const aiChanges = async (req, res) => {
  try {
    const { existingText, instructions, category } = req.body;
    if (!existingText || !instructions) {
      return res.status(400).json({ error: 'existingText and instructions are required' });
    }

    let maxTokens;

    if (category && (category.toLowerCase() === 'css' || category.toLowerCase() === 'js')) {
      const codeTokenMatch = instructions.match(/(\d+)\s*(tokens|word|words)?/i);
      maxTokens = codeTokenMatch ? parseInt(codeTokenMatch[1], 10) : 200;
    } else {
      const wordCountMatch = instructions.match(/(\d+)\s*(words|word)/i);
      maxTokens = wordCountMatch ? parseInt(wordCountMatch[1], 10) : 50;
    }

    let systemPrompt = '';

    if (category && category.toLowerCase() === 'css') {
      // For CSS changes
      systemPrompt = `
        You are an expert web developer specializing in CSS.
        The user wants to update an existing CSS code to reflect specific instructions.
        The existing CSS code is:
        """${existingText}"""
        
        The user's instructions are:
        """${instructions}"""
        
        Output ONLY the updated CSS code without any extra commentary.
      `;
    } else if (category && category.toLowerCase() === 'js') {
      // For JS changes
      systemPrompt = `
        You are an expert web developer specializing in JavaScript.
        The user wants to update an existing JavaScript code to reflect specific instructions.
        The existing JavaScript code is:
        """${existingText}"""
        
        The user's instructions are:
        """${instructions}"""
        
        Output ONLY the updated JavaScript code without any extra commentary.
      `;
    } else {
      // For text changes (including headings)
      const isHeading = instructions.toLowerCase().includes('heading');
      if (isHeading) {
        systemPrompt = `
          You are a professional web content writer specializing in ${category || 'website'} pages.
          The user wants to update an existing text to reflect specific instructions.
          The existing text is:
          """${existingText}"""
          
          The user's instructions are:
          """${instructions}"""
          
          Since the instructions mention a heading, output ONLY a concise heading (no more than 10 words) and nothing else.
          Do not add any commentary or extra tags. Output ONLY the final improved text.
        `;
      } else {
        systemPrompt = `
          You are a professional web content writer specializing in ${category || 'website'} pages.
          The user wants to update an existing text to reflect specific instructions.
          The existing text is:
          """${existingText}"""
          
          The user's instructions are:
          """${instructions}"""
          
          Rewrite the existing text to incorporate the user's instructions in a more engaging, professional, and structured way for a web page.
          Do not add any commentary or extra tags. Output ONLY the final improved text.
        `;
      }
    }

    const response = await together.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: existingText },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    let improvedText = response.choices[0].message.content.trim();

    // Clean up: remove stray <think> tags and extra unwanted characters
    improvedText = improvedText
      .replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '')
      .replace(/[^\w\s.,?!'"-]/g, '')
      .trim();

    console.log('Successfully processed AI changes.');
    res.json({ improvedText });
  } catch (error) {
    console.error('Error in aiChanges:', error.message);
    res.status(500).json({ error: 'Failed to process AI changes', details: error.message });
  }
};
