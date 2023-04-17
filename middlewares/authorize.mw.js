
const authorize = (roles) =>{

    return (req,res,next) =>{
        let role = req.body.role;
  
        console.log(req.body,"rrr")
        if(roles.includes(role)){
            next();
        }
        else{
            res.status(400).send({msg: "Not authorized"})
        }
    }
}



module.exports = authorize