require('dotenv').config();

async function checkModels() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      }
    });
    const data = await response.json();
    if (data.data) {
      const freeModels = data.data.filter(m => m.id.endsWith(':free'));
      console.log('Available FREE models:');
      freeModels.forEach(m => console.log(`- ${m.id} (${m.name})`));
    } else {
      console.log('Error fetching models:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkModels();
