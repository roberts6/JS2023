// import { Router } from "express";
// import bcrypt from "bcrypt";
// import User from "../models/user.model.js";

// const router = Router();

// // Vista para registro de usuarios
// router.get('/registro', (req, res) => {
//   res.render('registration-form');
// });

// // Ruta para crear un nuevo usuario
// router.post('/registro', async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Este correo ya está registrado' });
//     }
    
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const { email, name, lastName, age, role } = req.body;
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       name,
//       lastName,
//       age,
//       role: 'user'
//     });

//     await newUser.save();
//     const response = {
//       message: 'Usuario creado con éxito',
//       data: newUser,
//     };
    
//     // Redirigir a la vista de éxito
//     res.render('success', { message: 'Usuario registrado con éxito', user: newUser });

//   } catch (error) {
//     res.status(500).json({ message: 'Error en el servidor: ' + error.message });
//   }
// });


// // Ruta para modificar un usuario por su id
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { email, password, name, lastName } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         email,
//         password: hashedPassword,
//         name,
//         lastName
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ error: "Usuario no encontrado" });
//     }

//     const response = {
//       message: "Usuario actualizado",
//       data: updatedUser,
//     };
//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ error: "Error al actualizar el usuario" });
//   }
// });

// // Ruta para borrar un usuario por su id
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedUser = await User.findByIdAndDelete(id);

//     if (!deletedUser) {
//       return res.status(404).json({ error: "Usuario no encontrado" });
//     }

//     const response = {
//       message: "Usuario eliminado",
//       data: deletedUser,
//     };
//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ error: "Error al eliminar el usuario" });
//   }
// });

// export default router;

import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const router = Router();

// Vista para registro de usuarios
router.get('/registro',(req, res) => {
 res.render('registration-form');
});

//Ruta para crear un nuevo usuario
router.post('/registro',async (req, res) => {
 try {
 const existingUser = await User.findOne({email: req.body.email});
 if (existingUser) {
 return res.status(400).json({message: 'Este correo ya está registrado' });
 }

 const hashedPassword = await bcrypt.hash(req.body.password,bcrypt.genSalt());
const { email, name, lastName, age, role } = req.body;
const newUser = new User({
 email,
 password: hashedPassword,
 name,
 lastName,
 age,
 role: 'user'
 });

 await newUser.save();
const response = {
 message: 'Usuario creado con éxito',
 data: newUser,
 };

 // Redirigir a la vista de éxito
 res.render('success',{ message: 'Usuario registrado con éxito', user: newUser });

 } catch (error) {
 res.status(500).json({message: 'Error en el servidor: ' + error.message});
 }
});

// Ruta para modificar un usuario por su id
router.put("/:id",async (req, res) => {
 const { id } = req.params;
const { email, password, name, lastName } = req.body;

try {
 const hashedPassword = await bcrypt.hash(password,bcrypt.genSalt());

const updatedUser = await User.findByIdAndUpdate(
id,
 {
 email,
 password: hashedPassword,
 name,
 lastName
 },
 { new: true }
 );

 if (!updatedUser) {
 return res.status(404).json({error: "Usuario no encontrado" });
 }

 const response = {
 message: "Usuario actualizado",
 data: updatedUser,
 };
 res.json(response);
} catch (error) {
 res.status(500).json({error: "Error al actualizar el usuario" });
 }
});

// Ruta para borrar un usuario por su id
router.delete("/:id",async (req, res) => {
 const { id } = req.params;

try {
 const deletedUser = await User.findByIdAndDelete(id);

if (!deletedUser) {
 return res.status(404).json({error: "Usuario no encontrado" });
 }

 const response = {
 message: "Usuario eliminado",
 data: deletedUser,
 };
 res.json(response);
} catch (error) {
 res.status(500).json({error: "Error al eliminar el usuario" });
 }
});

export default router;

