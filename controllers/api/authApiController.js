const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../../db/models');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ message: 'Credenciales inválidas' });
        }

        const esPasswordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!esPasswordValida) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const payload = {
            usuario: {
                id: usuario.id,
                rol_id: usuario.rol_id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ token });
            }
        );
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logout exitoso. Elimine el token en el cliente.' });
}