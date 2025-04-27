const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/Admin');

module.exports = async (req, res) => {
    const { secret } = req.body;

    if (secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ message: 'Segredo inválido' });
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const admins = [];
        for (let i = 1; i <= 10; i++) {
            const email = `admin${i}@poderosascripto.com`;
            const password = `Cripto2025!${i}`;
            const hashedPassword = await bcrypt.hash(password, 10);
            admins.push({ email, password: hashedPassword });
        }

        await Admin.deleteMany({});
        await Admin.insertMany(admins);

        res.json({ message: 'Admins criados' });
    } catch (error) {
        console.error('Erro ao criar admins:', error);
        res.status(500).json({ message: 'Erro ao criar admins' });
    } finally {
        await mongoose.connection.close();
    }
};
