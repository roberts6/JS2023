// import passport from 'passport';
// import { Router } from "express";
// const router = Router();

// // Ruta de autenticación de GitHub. localhost:3000/auth/github funciona 🥳
// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// // Callback de Github
// router.get('/callback', (req, res) => {
//   // Maneja el callback de GitHub aquí
//   res.send('Callback de GitHub');
// });

// // Actualiza las rutas de registro y login para utilizar Passport
// router.post('/registro', passport.authenticate('local', {
//   successRedirect: '/products', // Ruta a redirigir en caso de éxito
//   failureRedirect: '/registro', // Ruta a redirigir en caso de fallo
//   failureFlash: true 
// }));

// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/products', 
//   failureRedirect: '/login', 
//   failureFlash: 'Nombre de usuario o contraseña inválidos.' // Mensaje de error para fallo
// }));


// export default router;

import passport from 'passport';
import CustomRouter from "../routes/customRouter.js";

class GithubRouter extends CustomRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  initRoutes() {
    this.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de Github
this.get('/callback', (req, res) => {
  // Maneja el callback de GitHub aquí
  res.send('Callback de GitHub');
});

// Actualiza las rutas de registro y login para utilizar Passport
this.post('/registro', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/registro',
  failureFlash: true
}));

this.post('/login', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/login',
  failureFlash: 'Nombre de usuario o contraseña inválidos.'
}));
  }}


  export default new GithubRouter().getRouter();