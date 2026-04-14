import express from 'express';
import {clerkWebhook} from '../controllers/webhook.js';

const router = express.Router();

router.post("/webhook/clerk",
express.raw({type: "application/json"}),
clerkWebhook
);

export default router;