import dotenv from 'dotenv';
import Together from 'together-ai';

dotenv.config();

if (!process.env.TOGETHER_API_KEY) {
  console.error('ERROR: TOGETHER_API_KEY is not set in .env file');
}

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export default together;
