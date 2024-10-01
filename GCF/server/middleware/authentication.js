const { validateToken } = require("../services/authentication");

function checkCookie(cookieName) {
    return (req, res, next) => {
        
        const cookieTokenValue = req.cookies[cookieName]; 

        if (!cookieTokenValue) {
            return res.status(401).json({ message: "Unauthorized access, please log in." });
        }

        try {
            const userPayload = validateToken(cookieTokenValue);
            // req.user = userPayload; 
            console.log(req.user);
            return next(); 

        } catch (error) {
            console.error("Invalid token:", error);
            return res.status(401).json({ message: "Invalid token, please log in again." });
        }
    }
}

module.exports = checkCookie;
