import * as React from 'react';
import ContactForm from '../components/ContactForm';
import '../styles.css';

export default function IndexPage() {
  return (
    <main className="page">
      <ContactForm />
    </main>
  );
}

export const Head = () => (
  <>
    <html lang="en" />
    <title>Gatsby Contact Form — Formclick</title>
    <meta name="description" content="A Gatsby contact form that sends submissions with the Formclick form API." />
  </>
);
