const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost/poderosas-cripto', { useNewUrlParser: true, useUnifiedTopology: true });

// Modelos
const memeCoinSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
});
const newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    link: String,
});
const xPostSchema = new mongoose.Schema({
    author: String,
    content: String,
});
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const MemeCoin = mongoose.model('MemeCoin', memeCoinSchema);
const News = mongoose.model('News', newsSchema);
const XPost = mongoose.model('XPost', xPostSchema);
const User = mongoose.model('User', userSchema);

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });
    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Rotas de Autenticação
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
});

// Registro de Admins (protegido por chave secreta)
const ADMIN_SECRET = 'sua-chave-secreta-aqui'; // Defina uma chave forte
app.post('/api/auth/register', async (req, res) => {
    const { email, password, secret } = req.body;
    if (secret !== ADMIN_SECRET) {
        return res.status(403).json({ message: 'Chave secreta inválida' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'E-mail já registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Usuário criado' });
});

// Script para criar até 10 admins iniciais (execute uma vez e remova)
async function createInitialAdmins() {
    const initialAdmins = [
        { email: 'crlosmodder@gmail.com', password: '101010' },
        { email: 'admin2@poderosascripto.com', password: 'Cripto2025!2' },
        { email: 'admin3@poderosascripto.com', password: 'Cripto2025!3' },
        { email: 'admin4@poderosascripto.com', password: 'Cripto2025!4' },
        { email: 'admin5@poderosascripto.com', password: 'Cripto2025!5' },
        { email: 'admin6@poderosascripto.com', password: 'Cripto2025!6' },
        { email: 'admin7@poderosascripto.com', password: 'Cripto2025!7' },
        { email: 'admin8@poderosascripto.com', password: 'Cripto2025!8' },
        { email: 'admin9@poderosascripto.com', password: 'Cripto2025!9' },
        { email: 'admin10@poderosascripto.com', password: 'Cripto2025!10' },
    ];

    for (const admin of initialAdmins) {
        const existingUser = await User.findOne({ email: admin.email });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const user = new User({ email: admin.email, password: hashedPassword });
            await user.save();
            console.log(`Admin criado: ${admin.email}`);
        } else {
            console.log(`Admin já existe: ${admin.email}`);
        }
    }
}
createInitialAdmins(); // Comente ou remova após executar

// Rotas de Meme Coins
app.get('/api/meme-coins', async (req, res) => {
    const memeCoins = await MemeCoin.find();
    res.json(memeCoins);
});
app.post('/api/meme-coins', authMiddleware, async (req, res) => {
    const memeCoin = new MemeCoin(req.body);
    await memeCoin.save();
    res.status(201).json(memeCoin);
});
app.delete('/api/meme-coins/:id', authMiddleware, async (req, res) => {
    await MemeCoin.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Rotas de Notícias
app.get('/api/news', async (req, res) => {
    const news = await News.find();
    res.json(news);
});
app.post('/api/news', authMiddleware, async (req, res) => {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
});
app.delete('/api/news/:id', authMiddleware, async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Rotas de Posts do X
app.get('/api/x-posts', async (req, res) => {
    const posts = await XPost.find();
    res.json(posts);
});
app.post('/api/x-posts', authMiddleware, async (req, res) => {
    const post = new XPost(req.body);
    await post.save();
    res.status(201).json(post);
});
app.delete('/api/x-posts/:id', authMiddleware, async (req, res) => {
    await XPost.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));