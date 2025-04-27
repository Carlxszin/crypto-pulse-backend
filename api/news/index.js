const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    link: String,
});
const News = mongoose.model('News', newsSchema);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método não permitido' });
    }
    try {
        const news = await News.find();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
