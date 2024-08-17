import { Router } from 'express';
import { allMessage, sendMessage } from '../controllers/message.controller';

const router = Router();

router.route('/sendMessage/:chatId').post(sendMessage);
router.route('/getallMessage').get(allMessage);

export { router };
