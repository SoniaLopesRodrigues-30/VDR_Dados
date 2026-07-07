import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message === 'Invalid login credentials' 
        ? 'E-mail ou senha incorretos.' 
        : error.message);
    } else {
      if (onLoginSuccess) onLoginSuccess(data.user);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Painel Administrativo</h2>
        <p style={styles.subtitle}>Entre com suas credenciais para acessar o sistema</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              placeholder="seuemail@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {errorMessage && <p style={styles.error}>{errorMessage}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', position: 'fixed', top: 0, left: 0 },
  card: { backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' },
  title: { margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  subtitle: { margin: '0 0 2rem 0', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
  input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' },
  button: { padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  error: { margin: 0, fontSize: '0.875rem', color: '#dc2626', textAlign: 'center' }
};
