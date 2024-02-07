import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import User from './models/user.model.js';
import bcrypt from 'bcrypt';

// Estrategia local para registro/login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
        
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
        
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);

// Estrategia de GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        // busca un usuario con el mismo email
        user = await User.findOne({ email: profile.emails[0].value });
        
        // Si no existe, crea un nuevo usuario con la información de GitHub
        if (!user) {
          user = await User.create({ 
            name: profile.displayName || profile.username,
            email: profile.emails && profile.emails[0].value,
            githubId: profile.id,
            password: '', 
            role: 'usuario' // rol por defecto
          });
        } else {
          // Si existe un usuario con esa dirección de correo, actualizarlo con el githubId
          user.githubId = profile.id;
          await user.save();
        }
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

// Serialización y deserialización del usuario para las sesiones
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
