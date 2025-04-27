const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const xPostSchema = new mongoose.Schema({
    author: String,
    content: String,
});
const XPost = mongoose.model('XPost', xPostSchema);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método não permitido' });
    }
    try {
        const posts = await XPost.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
