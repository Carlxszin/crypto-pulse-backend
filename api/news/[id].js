const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    link: String,
});
const News = mongoose.model('News', newsSchema);

module.exports = async (req, res) => {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Método não permitido' });
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        await News.findByIdAndDelete(req.query.id);
        res.status(204).send();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou erro no servidor' });
    }
};
