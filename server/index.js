const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Función que llama a la API de Groq
async function getGroqResponse(userInput) {
  const apiKey = process.env.GROQ_API_KEY;
  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  try {
    const res = await axios.post(endpoint, {
      model: 'gemma2-9b-it',
      messages: [
        { 
          role: 'system', 
          content: 'Eres un asistente personal amigable y útil. Responde de manera concisa pero amable.' 
        },
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const text = res.data.choices[0].message.content.trim();
    return text + ' 🤖';
  } catch (error) {
    console.error('❌ Error con Groq:', error.response?.data || error.message);
    throw new Error('Error con Groq API');
  }
}

// Respuestas locales inteligentes
function getSmartLocalResponse(msg) {
  const low = msg.toLowerCase();
  
  if (low.includes('hola') || low.includes('buenos días') || low.includes('buenas')) {
    return '¡Hola! ¿En qué puedo ayudarte hoy? 😊🤖';
  }
  
  if (low.includes('adiós') || low.includes('chau') || low.includes('hasta luego')) {
    return '¡Hasta luego! Que tengas un buen día 👋🤖';
  }
  
  if (low.includes('gracias')) {
    return '¡De nada! Estoy aquí para ayudarte 😊🤖';
  }
  
  if (low.includes('cómo estás') || low.includes('como estas')) {
    return '¡Estoy funcionando perfectamente! ¿Y vos cómo estás? 🤖';
  }
  
  if (low.includes('nombre') && low.includes('tuyo')) {
    return 'Soy tu asistente personal ChatBot. ¡Podés preguntarme lo que quieras! 🤖';
  }
  
  return 'Perdón, no entendí bien tu mensaje. ¿Podrías reformularlo? 🤔🤖';
}

// Ruta principal del chat
app.post('https://chat2-production-48eb.up.railway.app//chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Mensaje vacío' 
      });
    }

    console.log('💬 Mensaje recibido:', message);

    let botResponse;
    
    // Intentar obtener respuesta de Groq
    try {
      botResponse = await getGroqResponse(message);
      console.log('✅ Respuesta de Groq generada');
    } catch (error) {
      console.log('⚠️ Error con Groq, usando respuesta local');
      botResponse = getSmartLocalResponse(message);
    }

    // Simular delay para que parezca más natural
    await new Promise(resolve => setTimeout(resolve, 300));

    res.json({
      message: botResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error procesando mensaje:', error);
    res.status(500).json({
      message: 'Oops, tuve un problema técnico. ¿Podés intentar de nuevo? 🤖'
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor ChatBot Personal funcionando',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor ChatBot corriendo en http://localhost:${PORT}`);
  console.log('🤖 Listo para recibir mensajes');
});