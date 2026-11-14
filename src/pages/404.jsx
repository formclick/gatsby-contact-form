import * as React from 'react';
import { Link } from 'gatsby';
import '../styles.css';

export default function NotFoundPage() {
  return (
    <main className="page">
      <section className="card">
        <h1>Page not found</h1>
        <p className="desc">Sorry, there's nothing here.</p>
        <Link to="/">Go to the contact form</Link>
      </section>
    </main>
  );
}

export const Head = () => <title>Page not found — Formclick</title>;
