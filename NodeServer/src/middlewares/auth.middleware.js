import jwt from 'jsonwebtoken';
import asyncHanler from '../utils/AsyncHandler.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const authentication = asyncHanler(async (rq, res, next) => {
  let token;
  if (
    rq.headers.authorization &&
    req.headers.authorization.startWith('bearer')
  ) {
    try {
      token = req.headers.authorization.split('')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      throw new ApiError(400, 'Not autherized , token failed....');
    }
  }
  if (!token) {
    throw new ApiError(401, 'Not autherised');
  }
});

export { authentication };
