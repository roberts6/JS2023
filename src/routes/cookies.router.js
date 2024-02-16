import { Router } from "express";
const router = Router();

const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 días


// toma las cookies del request
router.get('/getCookies', (req, res) => {
  // Cookies no firmadas
  const cookies = req.cookies;
  // Cookies firmadas
  const signedCookies = req.signedCookies;
  res.json({ cookies, signedCookies });
});

// Setea una cookie
router.post('/setCookie', (req, res) => {
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
router.get('/deleteCookie', (req, res) => {
  const { name } = req.query;
  
  res.clearCookie(name);
  res.json({ message: `Cookie ${name} borrada` });
});

export default router;
