const User = require("../models/AdminUsers");


exports.addUser = async (req, res)=>{
    const {fullName, email, password} = req.body;
    
try {

    const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
   const newUser = await User.create({
        fullName,
        email,
        password,
    })
    return res.status(201).json(newUser);   
} catch (error) {
    return res.status(500).json({message:"Internal Server error", error})    
}
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("Token from matchPasswordAndGenerateToken:", token);
        
        if (!token) {
            return res.status(400).json({ message: "Invalid password or email" });
        }

        return res.cookie("token", token).status(200).json({ message: "Cookie created" });
    } catch (error) {
        console.error("Error in signin:", error); 
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

exports.logout = async (req, res) => {
   try {
    res.clearCookie("token");
   return res.status(200).json({ message: "Logout successful" });
   } catch (error) {
    console.error("Error during logout:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
   }
}





