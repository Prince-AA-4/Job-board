import { Op } from "sequelize";
import Users from "../database/models/user.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { fullName, userName, email, password, contact, role } = req.body;
    
    const existingUser = await Users.findOne({
      where: { [Op.or]: [{ email }, { userName }] },
    });
    
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    
    const newUser = await Users.create({
      fullName,
      userName,
      email,
      contact,
      role,
      password: hashpassword,
    });
    
    const token = generateToken(res, newUser.id, newUser.role);
    
    // Better approach: create clean response object
    const userResponse = {
      id: newUser.id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      contact: newUser.contact,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
    
    return res
      .status(201)
      .json({ message: "User registered successfully", token, user: userResponse }); 
      
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" }); 
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const isExistingUser = await Users.findOne({ where: { email } });
    if (!isExistingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Check password validity
    const isPassword = await bcrypt.compare(password, isExistingUser.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Invalid email or password" }); 
    }
    
    const token = generateToken(res, isExistingUser.id, isExistingUser.role);
    
    // Create clean response object
    const userResponse = {
      id: isExistingUser.id,
      fullName: isExistingUser.fullName,
      userName: isExistingUser.userName,
      email: isExistingUser.email,
      contact: isExistingUser.contact,
      role: isExistingUser.role,
      createdAt: isExistingUser.createdAt,
      updatedAt: isExistingUser.updatedAt
    };
    
    // Send response
    return res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: userResponse 
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" }); 
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({ message: "All users", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async(req, res) =>{
  const userId = req.params.id;
  try {
    const user = await Users.findByPk(userId);
    if(!user){
      return res.status(404).json({message: 'Oops! User not found'})
    }
    user.destroy();
    return res.status(200).json({message: "User deleted succesfully"});
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
