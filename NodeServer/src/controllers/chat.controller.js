import { Chat } from '../models/chat.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/AsyncHandler';

// create or fetch one to one chat
const accessChat = asyncHandler(async (req, res, err) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'userid params is not sent in request');
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'userName emailId profilePicture',
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      return res.status(200).json(201, FullChat, '');
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res, err) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'userName profilePicture emailId',
        });
        return res.status(200).json(new ApiResponse(200, results, ''));
      });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    throw new Error(400, 'Chat Not Found');
  } else {
    return res
      .status(201)
      .json(new ApiResponse(201, removed, 'userRemoveSuccefullyFromGroup'));
  }
});

const addToGroup = asyncHandler(async (req, res, err) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    throw new ApiError(400, 'Chat Not Found');
  } else {
    return res.status(201).json(201, added, 'chat delivered successfully');
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    throw new ApiError(400, 'Chat Not Found');
  } else {
    return res.status(200).json(new ApiResponse(201, updatedChat, ''));
  }
});

const createGroupChat = asyncHandler(async (req, res, err) => {
  if (!req.body.users || !req.body.userName) {
    return res.status(400).json(200, '', 'Please Fill all the feilds');
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json(200, '', 'More than 2 users are required to form a group chat');
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.userName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    return res
      .status(200)
      .json(new ApiResponse(201, fullGroupChat, 'created chat successFully'));
  } catch (error) {
    throw new ApiError(error.message);
  }
});

export {
  accessChat,
  fetchChats,
  removeFromGroup,
  addToGroup,
  renameGroup,
  createGroupChat,
};
