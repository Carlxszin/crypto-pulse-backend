const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const memeCoinSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
});
const MemeCoin = mongoose.model('MemeCoin', memeCoinSchema);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método não permitido' });
    }
    try {
        const memeCoins = await MemeCoin.find();
        res.json(memeCoins);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
