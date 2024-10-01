
const mongoose = require("mongoose");
const {createHmac, randomBytes,} = require("crypto")
const Schema = mongoose.Schema;
const {genarateTokenForUser,} = require("../services/authentication")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    
    }
},{timestamps:true});

userSchema.pre("save", function(next){
    const user=this;
    if(!user.isModified("password")) return ;

    const salt = randomBytes(16).toString();

    const hasedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex")

    this.password = hasedPassword,
    this.salt = salt;
next();
})
 
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) return null;

        const salt = user.salt;
        console.log("Salt:", salt);
        
        const hashedPassword = user.password;
        console.log("Stored Hashed Password:", hashedPassword);
        
        const userProvidedHashed = createHmac("sha256", salt).update(password).digest("hex");
        console.log("User Provided Hashed Password:", userProvidedHashed);

        if (hashedPassword !== userProvidedHashed) {
            return null;
        } else {
            const token = genarateTokenForUser(user);
            console.log("Generated Token:", token);
            return token;
        }
    } catch (error) {
        console.error("Error in matchPasswordAndGenerateToken:", error);
        throw error; // Ensure errors are thrown and caught in the calling function
    }
});

module.exports = mongoose.model("User",userSchema);