const User = require('../models/user')
module.exports = {
    getAllUsers: async (req, res) =>{
        try {
            const users = await User.findAll()
            res.status(200).json(users)
        }catch(error){
            res.status(500).json({message:'Error al obtener los usuarios'})
        }
    },
    createUser: async (req, res) =>{
        const {userName, firstName, lastName, email, phone, password, isAdmin} = req.body
        try {
            const user = await User.create({userName, firstName, lastName, email, phone, password, isAdmin})
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({message:'El usuario no pudo ser creado'})
        }
    },
    updateUser: async(res, req) => {
        const {id} = req.params
        const {userName, firstName, lastName, email, phone, password, isAdmin} = req.body
        try {
            const user = await User.findByPk(id)
            
        } catch (error) {
            
        } 
    }
}