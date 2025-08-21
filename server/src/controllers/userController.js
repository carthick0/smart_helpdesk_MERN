import userService from "../services/userService.js";

class UserController{
    async register(req,res){
        try {
            const {name,email,password,role}=req.body;
            const result=await userService.register({name,email,password,role});
            res.status(201).json({ message: "Successfully created user", data: result });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login({ email, password });
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new UserController()