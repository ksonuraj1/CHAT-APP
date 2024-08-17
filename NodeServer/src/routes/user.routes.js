import { Router } from 'express';
import {
  registerUser,
  loginUser,
  allUser,
} from '../controllers/user.controller';

const router = Router();
router.route('/resister').post(registerUser);
router.route('/login').post(loginUser);
router.route('/getAllUser').get(allUser);
