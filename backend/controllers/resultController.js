import Result from "../model/Result.js";
import { getAuth } from "@clerk/express";

//create a result
export const CreatemyResult = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }
        const result = await Result.create({
            ...req.body,
            userId
        });
        res.json(result);
    }
    catch (err) {
        console.log("CREATE RESULT ERROR:", err);
        res.status(500).json({ error: "Failed" });
    }
}

//to get result fro logged-in user
export const getMyResults = async (req,res) => {
    const { userId } = getAuth(req);
    const results = (await Result.find({userId})).sort({createdAt: -1});

    res.json(results);
}