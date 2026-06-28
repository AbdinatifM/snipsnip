import { validateUrl } from "../../../shared/validateUrl.js";
import { supabase } from "../lib/supabase.js";
import { urlService } from "../services/urlService.js";
import { Queue } from 'bullmq'
import Redis from 'ioredis'
import crypto from 'crypto'


const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null
});

const analyticsQueue = new Queue('AnalyticsStreaming', { connection: redisClient });

const generateShortCode = (length = 6) => {
    return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
}


export const shortenUrl =  async(req, res) => {
    const { originalUrl } = req.body;
    
    console.log(req.body, !originalUrl);
    if (!originalUrl) {
        return res.status(400).json({ error: "Missing the URL." });
    }

    if (!validateUrl(originalUrl)) {
        return res.status(400).json({ error: "Invalid URL." });
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
        return res.status(201).json({ shortCode: shortCode });
    } else {
        console.log(error);
        return res.status(500).json({ error: error});
    }
}

export const redirectShortCode =  async(req, res) => {
    const { shortCode } = req.params;
    try {
        const cachedUrl = await redisClient.get(`url:${shortCode}`);
       // console.log(cachedUrl);
        let targetUrl = cachedUrl;

        if (!targetUrl) {
            const { data, error} = await urlService.getByShortCode(shortCode);
            
            if (error || !data) return res.status(404).json({ message: "Url not found."}); 
            //console.log("data", data)

            
            targetUrl = data.original_url;
            
            await redisClient.set(`url:${shortCode}`, targetUrl, 'EX', 86400);
        }
        
        await analyticsQueue.add('logClick', {
            shortCode, 
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
            timestamp: new Date()
        }, { removeOnComplete: true})

        //console.log("final url: ", targetUrl);
        return res.redirect(302, targetUrl);
    } catch (error) {
         return res.status(500).json({ error: error });
    }
}