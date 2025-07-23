import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ msg: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Invalid token' });
  }
};
