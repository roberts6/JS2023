import { Router } from "express";
import CustomRouter from "../routes/customRouter.js";

const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 días

class CookiesRouter extends CustomRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  initRoutes() {
    // toma las cookies del request
this.get('/getCookies', (req, res) => {
  // Cookies no firmadas
  const cookies = req.cookies;
  // Cookies firmadas
  const signedCookies = req.signedCookies;
  res.json({ cookies, signedCookies });
});

// Setea una cookie
this.post('/setCookie', (req, res) => {
  const { name, value, signed } = req.body;
  const options = {
    maxAge: oneWeekInMilliseconds
  }
  if (signed) {
    // Establecer una cookie firmada
    res.cookie(name, value, { ...options, signed: true });
    res.json({ message: `Cookie firmada ${name}. En una semana se borra` });
  } else {
    // Establecer una cookie normal
    res.cookie(name, value, options);
    res.json({ message: `Cookie ${name} sin firma, también se borra en una semana` });
  }
});

// Borra una cookie por su nombre
this.get('/deleteCookie', (req, res) => {
  const { name } = req.query;
  
  res.clearCookie(name);
  res.json({ message: `Cookie ${name} borrada` });
});
  }}

  export default new CookiesRouter().getRouter();
