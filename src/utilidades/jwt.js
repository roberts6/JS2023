import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js'; 

// Define las opciones de la estrategia JWT
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'CoderKey'  
};

// Configura la estrategia JWT
passport.use(new Strategy(options, (payload, done) => {
  User.findById(payload) 
    .then(user => {
      if (user) {
        // El usuario ha sido encontrado en la base de datos
        return done(null, user);
      } else {
        // El usuario no fue encontrado
        return done(null, false);
      }
    })
    .catch(err => done(err, false));
}));
