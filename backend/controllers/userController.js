import User from '../model/User.js';
import { getAuth } from '@clerk/express';

//to get stats of a user
export const getStats = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorised"
            });

        }
        const totalUsers = await User.countDocuments();
        const loggedInUsers = await User.countDocuments({
            isLoggedIn: true
        });
        res.json({
            totalUsers,
            loggedInUsers: loggedInUsers,
            loggedInPercentage: totalUsers ?  ((loggedInUsers / totalUsers) * 100).toFixed(2) : "0.00",
        });
    }
    catch (err) {
        console.log("Admin stats error:", err);
        res.status(500).json({
            message: "Server Error",
        })

    }
}