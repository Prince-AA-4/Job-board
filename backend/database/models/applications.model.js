import { DataTypes } from "sequelize";
import sequelize from "../../config/dbConfig.js";
import Jobs from "./jobs.model.js";
import Users from "./user.model.js";


const Applications = sequelize.define('Application',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jobId:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Jobs,
            key: 'id'
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: Users,
            key: 'id'
        }
    },
    status:{
        type:DataTypes.ENUM('applied','interviewed', 'hired', 'rejected'), 
        allowNull: false,

    },
    resume:{
        type:DataTypes.STRING,
        allowNull: false,
    }
})



export default Applications;

export const applicationTable= async()=>{
    try {
        await Applications.sync()
        console.log('Application table  successfully created');
    } catch (error) {
        console.error('Error creating application table:', error)   
    }  
}