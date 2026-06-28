import { Worker } from "bullmq";
import  Redis from 'ioredis';
import { supabase } from "../lib/supabase.js";
import { urlService } from "./urlService.js";


const connection = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null
});

const analyticsWorker = new Worker('AnalyticsStreaming', async (job) => {
    const { shortCode, ip_address, user_agent } = job.data;
    
    console.log(`Processing analytics for ${shortCode}`);

    await urlService.incrementClicks(shortCode);

    const { error } = await supabase
    .from('analytics')
    .insert([{
        short_code: shortCode,
        ip_address: ip_address,
        user_agent: user_agent
    }]);

  if (error) throw error;

}, { connection });


