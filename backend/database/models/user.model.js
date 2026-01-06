import { DataTypes } from "sequelize";
import sequelize from "../../config/dbConfig.js";

const Users = sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName:{
        type:DataTypes.STRING,
        allowNull: false
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false
    },
    contact:{
        type:DataTypes.STRING,
        allowNull: true
    },

    role:{
        type: DataTypes.ENUM('admin', 'employer','applicant'),
        allowNull: false,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true // Only has a value when a reset is requested
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true // Only has a value when a reset is requested
    }
})



export default Users;


export const usersTable= async()=>{
    try {
        await Users.sync({alter: true})
        console.log('Users table  successfully created');
    } catch (error) {
        console.error('Error creating users table:', error)   
    }  
}