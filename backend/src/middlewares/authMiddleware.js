import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Check token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        return res.status(401).json({
            message: 'Unauthorized'
        });

    }

    try {

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user data in request
        req.user = decoded;

        // Move to next middleware/controller
        next();

    }
    catch (error) {

        return res.status(401).json({
            message: 'Invalid Token'
        });

    }

}