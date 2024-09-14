import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjfmzuipfwplcmgfccdj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZm16dWlwZndwbGNtZ2ZjY2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4NzgzMzgsImV4cCI6MjAyNzQ1NDMzOH0.NOJUGhwv4Algz4C2qa0iJrAAXS36_UC28JN349JLdlk';

export const supabase = createClient(supabaseUrl, supabaseKey);
