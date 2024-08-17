import asyncHandler from '../utils/AsyncHandler';
import { Message } from '../models/message.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model';
import { Chat } from '../models/chat.model';

const allMessage = asyncHandler(async (req, res, err) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'userName, emailId, profilePicture')
      .populate('chat');

    return res.status(201).json(new ApiResponse(200, messages, ''));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const sendMessage = asyncHandler(async (req, res, err) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    throw new ApiError(400, 'invalid data passed into request');
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chatId: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await Message.populate(
      'sender',
      'userName profilePicture'
    ).execPopulate();
    message = await Message.populate('chat').execPopulate();
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'userName emailId, profilePicture',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export { allMessage, sendMessage };
