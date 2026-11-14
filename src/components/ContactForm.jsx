import * as React from 'react';
import { useState } from 'react';

// Formclick form API: one POST request, no backend of your own.
const ENDPOINT = 'https://api.formclick.io/submit';
// Set in .env.development / .env.production (see .env.example).
// The key can only create submissions, so it's safe in client code.
const ACCESS_KEY = process.env.GATSBY_FORMCLICK_ACCESS_KEY;

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!ACCESS_KEY || ACCESS_KEY === 'YOUR_ACCESS_KEY') {
      setStatus('error');
      setError('Add your access key to .env.development as GATSBY_FORMCLICK_ACCESS_KEY, then restart gatsby develop.');
      return;
    }

    setStatus('sending');
    setError('');

    // Every field with a name is sent. _honeypot stays empty for real visitors.
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, access_key: ACCESS_KEY, subject: 'New message from the Gatsby contact form' }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setStatus('sent');
        form.reset();
      } else if (res.status === 429) {
        setStatus('error');
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setStatus('error');
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Network error. Please check your connection and try again.');
    }
  }

  if (status === 'sent') {
    return (
      <section className="card">
        <h1>Thanks!</h1>
        <p className="desc">Your message has been sent. We'll get back to you soon.</p>
        <button type="button" onClick={() => setStatus('idle')}>Send another message</button>
      </section>
    );
  }

  return (
    <section className="card">
      <h1>Contact us</h1>
      <p className="desc">Send us a message and we'll get back to you.</p>

      <form onSubmit={handleSubmit}>
        {/* Honeypot: hidden from people, bots fill it and the submission is discarded */}
        <input type="text" name="_honeypot" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <div className="row">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Jane Smith" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="jane@example.com" required />
          </div>
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" placeholder="Write your message…" required />
        </div>

        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'error' && <p className="msg msg-error" role="alert">{error}</p>}
      </form>
    </section>
  );
}
