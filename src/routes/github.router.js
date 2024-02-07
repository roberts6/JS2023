import passport from '../routes/github.router.js'
import { Router } from "express";
const router = Router();

// Ruta de autenticación de GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de Github
router.get(
  '/auth/github', 
  passport.authenticate('github', { failureRedirect: '/login' }), 
  (req, res) => {
    // si la autenticación es exitosa redirige a productos
    res.redirect('/products');
  }
);

// Actualiza las rutas de registro y login para utilizar Passport
router.post('/registro', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/registro',
  failureFlash: true // envía mensaje de error 
}));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/login',
  failureFlash: true // envía mensaje de error
}));

export default router;