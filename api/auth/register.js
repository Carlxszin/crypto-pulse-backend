const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const User = mongoose.model('User', userSchema);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }
    const { email, password, secret } = req.body;
    if (secret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Chave secreta inválida' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'E-mail já registrado' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Usuário criado' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
