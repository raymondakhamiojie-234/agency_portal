import axios from 'axios';

const NVIDIA_API_KEY = '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';
const url = "https://integrate.api.nvidia.com/v1/models";

async function test() {
  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`
      }
    });

    const allModels = response.data.data.map(m => m.id);
    console.log("Llama models:", allModels.filter(m => m.includes('llama')));
    console.log("Gemma models:", allModels.filter(m => m.includes('gemma')));
  } catch (err) {
    if (err.response) {
      console.error("API Error Response:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

test();
