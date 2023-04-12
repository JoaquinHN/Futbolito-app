const controller = {}

controller.indexController = async (req, res, next) => {
    res.render('index', {title: 'Hola Mundo'})
}

module.exports = controller


