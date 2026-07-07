import { createClient } from '@supabase/supabase-js';

// Remove barras extras, espaços ou subpastas fantasmas que o Vite possa ler do .env
const urlBase = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, "");
const chaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Recria a URL limpa garantindo que ela aponte estritamente para o servidor principal
export const supabase = createClient(urlBase, chaveAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false // Impede o React de tentar adivinhar rotas pela URL do navegador
  }
});
