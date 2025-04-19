const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const CMC_API_KEY = process.env.CMC_API_KEY || 'sua-chave-de-fallback'; // Substitua pela chave real apenas para testes locais

// Rota para listar criptomoedas (CoinMarketCap)
app.get('/cmc/listings', async (req, res) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY },
      params: {
        limit: 5000, // Ajuste conforme necessário
        convert: 'BRL' // Preços em reais
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro na rota /cmc/listings:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Rota para detalhes de uma moeda (CoinMarketCap)
app.get('/cmc/info', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Parâmetro "id" é obrigatório' });
    }
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/info', {
      headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY },
      params: { id }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro na rota /cmc/info:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Rota para dados de mercado (CoinGecko)
app.get('/cg/markets', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'brl',
        per_page: 250,
        page,
        sparkline: false
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro na rota /cg/markets:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Exporta o app para o Vercel
module.exports = app;
