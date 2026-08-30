import axios from 'axios';

const NVIDIA_API_KEY = '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';
const NVIDIA_INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

async function test() {
  try {
    const response = await axios.post(NVIDIA_INVOKE_URL, {
      model: "google/gemma-4-31b-it",
      messages: [{role: "user", content: "Hello, are you there?"}],
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.95
    }, {
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Success:", response.data.choices[0].message.content);
  } catch (err) {
    if (err.response) {
      console.error("API Error Response:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

test();
