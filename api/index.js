const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY || 'sua-chave-de-fallback';

// Rota para listar criptomoedas (CryptoCompare)
app.get('/cc/listings', async (req, res) => {
  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/top/mktcapfull', {
      params: {
        limit: 100,
        tsym: 'BRL',
        api_key: CRYPTOCOMPARE_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro na rota /cc/listings:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Rota para detalhes de uma moeda (CryptoCompare)
app.get('/cc/info', async (req, res) => {
  try {
    const { fsym } = req.query;
    if (!fsym) return res.status(400).json({ error: 'Parâmetro "fsym" é obrigatório' });
    const response = await axios.get('https://min-api.cryptocompare.com/data/coin/generalinfo', {
      params: {
        fsyms: fsym,
        tsym: 'BRL',
        api_key: CRYPTOCOMPARE_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro na rota /cc/info:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Rota para dados de mercado (CoinGecko, mantido como fallback)
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

module.exports = app;
