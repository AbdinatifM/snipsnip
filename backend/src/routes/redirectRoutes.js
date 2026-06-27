import express from 'express'
import { redirectShortCode } from '../controllers/urlController.js'
const router = express.Router();


app.get("/:shortCode", redirectShortCode);


export default router;