import { DataTypes } from "sequelize";
import Company from "./company.model.js";
import sequelize from "../../config/dbConfig.js";

const Jobs = sequelize.define('Job',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull:false,
        
    },
    description:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    companyId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Company,
            key: "id"
        }
    },
    jobType:{
        type:DataTypes.ENUM('Full-Time', 'Part-Time','Internship'),
        allowNull: false
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type: DataTypes.ENUM('active', 'closed'),
        allowNull: false,
        defaultValue: 'active'
    },
    salary:{
        type:DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Competitive'
    },
    deadline:{
        type:DataTypes.DATEONLY,
        allowNull: true
    }
})


export default Jobs;

export const jobsTable= async()=>{
    try {
        await Jobs.sync()
        console.log('Jobs table  successfully created');
    } catch (error) {
        console.error('Error creating jobs table:', error)   
    }  
}