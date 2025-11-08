const authService = require('../../services/authServices');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.loginUser(email, password);

        res.status(200).json({ token });
    } catch (error) {
        if (error.message === 'Credenciales inválidas') {
            return res.status(401).json({ message: error.message });
        }
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logout exitoso. Elimine el token en el cliente.' });
}