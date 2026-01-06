import Users from "./user.model.js";
import Jobs from "./jobs.model.js";  
import Company from "./company.model.js";
import Applications from "./applications.model.js";


// Create associations

Users.hasMany(Company,
    {
        foreignKey: 'userId',
        as: 'company',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
);

Company.belongsTo(Users,
    {
        foreignKey: 'userId',
    as: 'User'
});



Company.hasMany(Jobs,{
    foreignKey: 'companyId',
    as: 'jobs',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Jobs.belongsTo(Company,{
    foreignKey: 'companyId',
    as:'Company'
})

Users.hasMany(Applications,{
    foreignKey: 'userId',
    as: 'applications',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Applications.belongsTo(Users,{
    foreignKey: 'userId',
    as: 'user',
})

Jobs.hasMany(Applications,{
    foreignKey: 'jobId',
    as: 'applications',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Applications.belongsTo(Jobs,{
    foreignKey:'jobId',
    as:'job'
})


export default {Users, Company, Jobs, Applications}