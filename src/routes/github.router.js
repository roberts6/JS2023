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
this.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', (err, user, info) => {
    if (err) {
      return next(err); // Manejar errores de autenticación
    }
    if (!user) {
      return res.redirect('/login'); // Redirigir si la autenticación falla
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/callback'); // Redirige al login de github
    });
  })(req, res, next);
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