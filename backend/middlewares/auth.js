import { JWT_SECRET } from '../config/config.js';
import jwt from 'jsonwebtoken';
export const protect = (req, res, next) => {
  let token;

 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; 

      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
      }
      const decoded = jwt.verify(token, JWT_SECRET); 



      req.user = { id: decoded.userId };  
      
      next();  
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
