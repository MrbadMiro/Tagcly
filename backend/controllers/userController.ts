import { Request, Response } from 'express'; // Importing types for Request and Response from Express
import User, { IUser } from '../models/userModel.ts'; // Importing User model and IUser interface
import asyncHandler from '../middlewares/asyncHandler.ts'; // Importing asyncHandler middleware for error handling
import bcrypt from 'bcryptjs'; // Importing bcrypt for password hashing
import generateToken from '../utils/createToken.ts'; // Importing token generation utility
import { Document, Types } from 'mongoose'; // Importing Document and Types from Mongoose

// Interface to define the structure of the user response
interface UserResponse {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

// Extend the Request type to include the user property for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: IUser; // Optional user property
}

// Handler to create a new user
const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body; // Destructure request body for user data

  // Validate input fields
  if (!username || !email || !password) {
    throw new Error('Please fill all the inputs.'); // Throw error if any field is empty
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send('User already exists'); // Send error if user already exists

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10); // Generate salt for hashing
  const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
  const newUser = new User({ username, email, password: hashedPassword }); // Create new user instance

  try {
    await newUser.save(); // Save the new user to the database
    generateToken(res, newUser._id.toString()); // Generate a token and send it as a cookie

    // Send success response with user details
    res.status(201).json({
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400); // Send error status if there's an issue saving the user
    throw new Error('Invalid user data'); // Throw error for invalid data
  }
});

// Handler for user login
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body; // Destructure request body for email and password

  // Debug logging for email and password
  console.log(email);
  console.log(password);

  // Find the existing user by email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      generateToken(res, existingUser._id.toString()); // Generate token if password is valid

      // Send success response with user details
      res.status(201).json({
        _id: existingUser._id.toString(),
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return; // Exit the function after successful login
    }
  }

  res.status(401); // Send unauthorized status if login fails
  throw new Error('Invalid email or password'); // Throw error for invalid credentials
});

// Handler to logout the current user
const logoutCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // Clear the JWT cookie
  res.cookie('jwt', '', {
    httpOnly: true, // Cookie cannot be accessed by JavaScript
    expires: new Date(0), // Set expiration to the past
  });

  res.status(200).json({ message: 'Logged out successfully' }); // Send success response
});

// Handler to get all users
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}); // Fetch all users from the database
  res.json(users); // Send the list of users as a response
});

// Handler to get the current user's profile
const getCurrentUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.user?._id); // Fetch the authenticated user

  if (user) {
    // Send the user details as a response
    res.json({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404); // Send not found status if user is not found
    throw new Error('User not found.'); // Throw error for user not found
  }
});

// Handler to update the current user's profile
const updateCurrentUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.user?._id); // Fetch the authenticated user

  if (user) {
    // Update user properties with new values or keep existing values
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // If a new password is provided, hash it before saving
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save(); // Save the updated user

    // Send updated user details as a response
    res.json({
      _id: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404); // Send not found status if user is not found
    throw new Error('User not found'); // Throw error for user not found
  }
});

// Handler to delete a user by ID
const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id); // Find user by ID from request parameters

  if (user) {
    // Prevent deletion of admin users
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user'); // Throw error if trying to delete admin
    }

    await User.deleteOne({ _id: user._id }); // Delete the user
    res.json({ message: 'User removed' }); // Send success message
  } else {
    res.status(404); // Send not found status if user is not found
    throw new Error('User not found.'); // Throw error for user not found
  }
});

// Handler to get a user by ID
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password'); // Fetch user by ID, excluding password

  if (user) {
    // Send user details as a response
    res.json({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404); // Send not found status if user is not found
    throw new Error('User not found'); // Throw error for user not found
  }
});

// Handler to update a user by ID
const updateUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id); // Find user by ID

  if (user) {
    // Update user properties with new values
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin); // Convert isAdmin to boolean

    const updatedUser = await user.save(); // Save the updated user

    // Send updated user details as a response
    res.json({
      _id: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404); // Send not found status if user is not found
    throw new Error('User not found'); // Throw error for user not found
  }
});

// Export all user-related handlers
export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
