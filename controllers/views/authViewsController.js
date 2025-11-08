exports.getHome = (req, res) => {
    try {
        
        res.render('index', {
            title: 'Horizon'
        });
    } catch (error) {
        console.error('Error al renderizar el index:', error);
        res.status(500).send('Error interno del servidor al cargar la página.');
    }
};