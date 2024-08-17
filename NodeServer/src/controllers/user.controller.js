import { asyncHandler } from '../utils/AsyncHandler';
import ApiError from '../utils/ApiError';
import { User } from '../models/user.model';

const registeredUser = asyncHandler(async (req, res, err) => {
  const { userName, emailId, password } = req.body;
  if ([userName, emailId, password].some((item) => item.trim === '')) {
    throw new ApiError(400, 'all fields are requierd');
  }

  const existedUser = User.findOne({
    $or: [{ userName }, { emailId }],
  });
  if (existedUser) {
    throw new ApiError(400, 'User is Existed');
  }

  const user = User.create({
    userName: userName.toLowerCase(),
    emailId,
    password,
    profilePicture,
    isAdmin,
  });

  const createUser = await User.findById(user._id).select('-password');

  if (!createUser) {
    throw new ApiError(500, 'Something went wrong while creating users');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, 'user Resistered successFully'));
});

const loginUser = asyncHandler(async (req, res, err) => {
  const { userName, emailId, password, profilePicture } = req.body;
  const user = User.findOne({ emailId, userName });
  const existedUser = {
    _id: user._id,
    userName: user.userName,
    emailId: user.emailId,
    password: user.password,
    profilePicture: user.profilePicture,
  };

  if (user && (await user.matchPassword(password))) {
    return res
      .status(201)
      .json(new ApiResponse(200, existedUser, 'user Details'));
  } else {
    throw new ApiError(400, ' invalid Email or password');
  }
});

const allUser = asyncHandler(async (req, res, err) => {
  const keyword = req.query.search
    ? {
        $or: [
          { userName: { $regex: req.query.search, $options: 'i' } },
          { emailId: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  return res.status(201).json(new ApiResponse(201, users, 'fetched all users'));
});
export { registeredUser, loginUser, allUser };
