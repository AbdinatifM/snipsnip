import express from 'express'
import { shortenUrl } from '../controllers/urlController';

const router = express.Router();


router.post("/shorten", shortenUrl);



export default router;