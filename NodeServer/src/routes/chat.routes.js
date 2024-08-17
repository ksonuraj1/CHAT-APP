import { Router } from 'express';
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from '../controllers/chat.controller';

const router = Router();
router.route('/accessChat').post(accessChat);
router.route('fetchChat').get(fetchChats);
router.route('/createGroupChat').post(createGroupChat);
router.route('/rename').put(renameGroup);
router.route('/groupremove').put(removeFromGroup);
router.route('/groupadd').put(addToGroup);

export { router };
