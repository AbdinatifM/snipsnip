import { supabase } from "../lib/supabase.js"
export const urlService = {
    async createUrl(originalUrl, shortCode) {
        return await supabase
            .from("urls")
            .insert({
                original_url: originalUrl,
                short_code: shortCode,
                clicks: 0,
            })
            .select()
            .single();
    },

    async getByShortCode(shortCode) {
        return await supabase
            .from("urls")
            .select("*")
            .eq('short_code', shortCode)
            .single();
    },

    async incrementClicks(shortCode) {
        const { data, error } = await supabase
            .from("urls")
            .select("clicks")
            .eq("short_code", shortCode)
            .single();
        
        if ( error || !data ) return { data: null, error};

        return await supabase
            .from("urls")
            .update({ clicks: data.clicks + 1 })
            .eq("short_code", shortCode);
    },
    
    async deleteUrl(id) {
        return await supabase
            .from("urls")
            .delete()
            .eq("id", id);
    }
}