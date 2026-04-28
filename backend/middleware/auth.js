import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import User from '../model/User.js';

export const protect = ClerkExpressWithAuth();

export const isAdmin = async (req, res, next) => {
    try {
        const clerkId = req.auth.userId;
        const user = await User.findOne({ clerkId });

        if (user && user.role === "admin") {
            next();
        }
        else {
            res.status(403).json({
                message: "Access Denied. Admins only."
            });
        }

    }
    catch (error) {
        res.status(500).json({ message: "Server Error" , error });
    }
}