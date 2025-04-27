const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const xPostSchema = new mongoose.Schema({
    author: String,
    content: String,
});
const XPost = mongoose.model('XPost', xPostSchema);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const post = new XPost(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou erro no servidor' });
    }
};
