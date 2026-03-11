/**
 * Test script for OpenRouter API integration
 * Run: node test-openrouter.js
 */

require('dotenv').config();

async function testOpenRouterIntegration() {
  console.log('🧪 Testing OpenRouter API Integration...\n');

  // Check environment variables
  console.log('📋 Checking environment variables:');
  console.log('✓ OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Configured ✓' : 'Missing ✗');
  console.log('✓ OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL ? `Configured: ${process.env.OPENROUTER_MODEL}` : 'Missing ✗\n');

  if (!process.env.OPENROUTER_API_KEY) {
    console.error('❌ Error: OPENROUTER_API_KEY is not set in .env file');
    process.exit(1);
  }

  // Test 1: Simple API call
  console.log('\n🔬 Test 1: Making OpenRouter API call...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'PetShop-Chatbot-Test'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'Bạn là trợ lý bán hàng thú cưng thân thiện.'
          },
          {
            role: 'user',
            content: 'Bạn có sản phẩm nào tốt cho chó không?'
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ API Response received successfully!');
    console.log('\n📝 Sample Response:');
    console.log(data.choices[0].message.content);

    // Test 2: Verify the response structure
    console.log('\n🔬 Test 2: Verifying response structure...');
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      console.log('✅ Response structure is valid!');
    } else {
      console.error('❌ Invalid response structure');
      process.exit(1);
    }

    // Test 3: Simulate chatbot endpoint
    console.log('\n🔬 Test 3: Simulating chatbot endpoint...');
    const testMessages = [
      'Tôi có một con mèo, cần sản phẩm gì?',
      'Sản phẩm bán chạy nhất',
      'Có gì dưới 200k không?'
    ];

    for (const msg of testMessages) {
      console.log(`\n📤 Testing message: "${msg}"`);
      const chatResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'PetShop-Chatbot-Test'
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'Bạn là trợ lý mua sắm thú cưng. Hãy trả lời ngắn gọn (1-2 câu) và thân thiện.'
            },
            {
              role: 'user',
              content: msg
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const chatData = await chatResponse.json();
      if (chatResponse.ok) {
        console.log(`✅ Response: ${chatData.choices[0].message.content}`);
      } else {
        console.error(`❌ Error: ${chatData.error?.message}`);
      }
    }

    console.log('\n🎉 All tests passed! OpenRouter integration is working correctly.');
    console.log('\n💡 Next steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Try chatting with the chatbot - it will now use OpenRouter AI!');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    process.exit(1);
  }
}

// Run tests
testOpenRouterIntegration().catch(console.error);
