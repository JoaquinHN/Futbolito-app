const bcrypt = require('bcrypt')
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
            // Encriptar contraseña antes de guardarla
            const hashedPassword = bcrypt.hashSync(password,10)
            // console.log(hashedPassword)
            const user = await User.create({userName, firstName, lastName, email, phone, password: hashedPassword, isAdmin})
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({message:'El usuario no pudo ser creado'})
        }
    },
    updateUserbyId: async(req, res) => {
        const {id} = req.params
        const {userName, firstName, lastName, email, phone, password, isAdmin} = req.body
        try {
            const user = await User.findByPk(id)
            if(user){
                const updateUser = user.update({userName, firstName, lastName, email, phone, password, isAdmin})
                res.status(200).json(user)
            }else{
                res.status(404).json({message:`Usuario con el ID: ${id} no fue encontrado`})
            }
            
        } catch (error) {
            res.status(500).json({message:'Error al actualizar el usuario'})
        } 
    },
    findUserbyId: async(req, res) => {
        const {id} = req.params
        try {
            const user = await User.findByPk(id)
            if(user){
                res.status(200).json(user)
            }else{
                res.status(404).json({message:`Usuario con el ID: ${id} no encontrado`})
            }
        } catch (error) {
            res.status(500).json({message:'Error al encontrar el usuario'})
        }
    },
    deleteUser: async(req, res) => {
        const {id} = req.params
        try {
            const user = await User.findByPk(id)
            if(user){
                await user.destroy()
                res.status(204).json({message:'Usuario eliminado correctamente'})
            }else{
                res.status(404).json({message:`Usuario con el ID: ${id} no fue encontrado`})
            }
        } catch (error) {
            res.status(500).json({message:'Error al eliminar el usuario'})
        }
    }
}