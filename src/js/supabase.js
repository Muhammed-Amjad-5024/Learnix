import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://lvfoqlmtlvhgfusbbbju.supabase.co";
const supabasePublishableKey = "sb_publishable_gebq9vz7dLfntjK9VMXvaQ_l-yRAZK8";

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
);