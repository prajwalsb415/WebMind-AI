import together from '../config/togetherClient.js';

export const generateWebsite = async (req, res) => {
  try {
    const { prompt, category, themeColor } = req.body;
    console.log('Received website generation request with:', {
      promptLength: prompt?.length,
      category: category || 'none',
      themeColor,
    });

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    if (!process.env.TOGETHER_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Generate HTML code with theme color information
    const htmlSystemPrompt = `You are an expert web developer. Generate ONLY the complete HTML code for a website based on the following prompt: "${prompt}". The HTML must be fully GrapesJS compatible and include a container with id="gjs". The website should have a primary color theme based on ${themeColor}. Do not include any extra commentary, explanations, or <think> tags. Output ONLY the HTML code starting with <!DOCTYPE html>.`;
    const htmlResponse = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      messages: [
        { role: "system", content: htmlSystemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 5000,
      temperature: 0.7
    });
    let htmlContent = htmlResponse.choices[0].message.content.trim();
    htmlContent = htmlContent.replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '').trim();
    console.log("Generated HTML:", htmlContent);

    // Generate CSS code with theme color information
    const cssSystemPrompt = `You are an expert web developer. Generate ONLY the complete CSS code for styling the website described by the following prompt: "${prompt}". The website should have a primary color theme based on ${themeColor}. The CSS must be compatible with the previously generated HTML. Do not include any extra commentary, explanations, or <think> tags. Output ONLY the CSS code.`;
    const cssResponse = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      messages: [
        { role: "system", content: cssSystemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 6500,
      temperature: 0.7
    });
    let cssContent = cssResponse.choices[0].message.content.trim();
    cssContent = cssContent.replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '').trim();
    console.log("Generated CSS:", cssContent);

    // Generate JavaScript code
    const jsSystemPrompt = `You are an expert web developer. Generate ONLY the complete JavaScript code for a website based on the following prompt: "${prompt}". The JavaScript should be minimal and enable basic interactivity. Do not include any extra commentary, explanations, or <think> tags. Output ONLY the JavaScript code.`;
    const jsResponse = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      messages: [
        { role: "system", content: jsSystemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.7
    });
    let jsContent = jsResponse.choices[0].message.content.trim();
    jsContent = jsContent.replace(/<\s*think\s*>[\s\S]*?<\s*\/\s*think\s*>/gi, '').trim();
    console.log("Generated JavaScript:", jsContent);

    console.log('Successfully generated website code');
    res.json({ html: htmlContent, css: cssContent, js: jsContent });
  } catch (error) {
    console.error('Error in generateWebsite:', error.message);
    res.status(500).json({ error: 'Failed to generate website', details: error.message });
  }
};
