import express from 'express'
import { redirectShortCode } from '../controllers/urlController.js'
import app from '../app.js'
const router = express.Router();


app.get("/:shortCode", redirectShortCode);


export default router;