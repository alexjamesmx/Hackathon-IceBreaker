// src/utils/fetchResponse.js

const axios = require("axios");

async function getOpenAIResponse(prompt, key) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-002",
        prompt: prompt,
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error connecting to OpenAI API:", error);
    throw error;
  }
}

async function fetchResponse(setQuestion, prompt, key) {
  try {
    const response = await getOpenAIResponse(prompt);
    console.log("OpenAI API Response:", response);
    setQuestion(response.choices[0].text.trim());
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = fetchResponse;
