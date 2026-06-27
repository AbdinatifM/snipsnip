import { urlService } from "../services/urlService";
import crypto from 'crypto'

const generateShortCode = (length = 6) => {
    return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
}


export const shortenUrl =  async(req, res) => {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
        return res.status(400).send({ error: "Missing the URL." });
    }

    let shortCode;
    let exists = true;

    while (exists) {
        shortCode = generateShortCode(6);
        const { data } = await urlService.getByShortCode(shortCode);
        exists = !!data;
    }


    const { data, error } = await urlService.createUrl(originalUrl, shortCode);
    

    if (!error) {
        return res.status(201).json({shortCode});
    } else {
        return res.status(500).json({ error: error});
    }
}

export const redirectShortCode =  async(req, res) => {
    const { shortCode } = req.params;
    const { data, error} = await urlService.getByShortCode(shortCode);

    if (!error){
        return res.redirect(302, data.originalUrl);
    } else {
        return res.status(500).json({ error: error });
    }
}