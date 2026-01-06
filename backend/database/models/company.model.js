import { DataTypes } from "sequelize";
import sequelize from "../../config/dbConfig.js";
import Users from "./user.model.js";


const Company = sequelize.define('Company',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    location:{
        type:DataTypes.STRING,
        allowNull: false
    },
    industry:{
        type:DataTypes.STRING,
        allowNull: false
    },
    website:{
        type:DataTypes.STRING,
        allowNull: true,
        validate:{
            isUrl:true
        }
    },
    description:{
        type:DataTypes.TEXT,
        allowNull: true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: Users,
            key: 'id'
        }
    }
});


export default Company;

export const companyTable= async()=>{
    try {
        await Company.sync()
        console.log('Company table  successfully created');
    } catch (error) {
        console.error('Error creating company table:', error)   
    }  
}