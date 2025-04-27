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
    if (req.body.secret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Chave secreta inválida' });
    }
    const initialAdmins = [
        { email: 'admin1@poderosascripto.com', password: 'Cripto2025!1' },
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
    try {
        for (const admin of initialAdmins) {
            const existingUser = await User.findOne({ email: admin.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(admin.password, 10);
                const user = new User({ email: admin.email, password: hashedPassword });
                await user.save();
            }
        }
        res.status(201).json({ message: 'Admins criados' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
