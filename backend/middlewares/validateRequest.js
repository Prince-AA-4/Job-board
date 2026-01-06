const validateRequest = (schema)=> {
    return (req, res, next) =>{
        try {
            const {error} = schema.validate(req.body, {abortEarly: false})
            console.error(error);
            if (error){
                const errors = error.details.map((error) => error.message);
                return res.status(400).json({ errors }); 
            }
            next();
        } catch (error) {
            return next(error);
        }
    }

}


export default validateRequest;