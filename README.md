# Gatsby contact form

A working Gatsby contact form that sends submissions with the [Formclick](https://www.formclick.io) form API. No Gatsby Functions, no serverless setup, no email service: the browser posts straight to Formclick, and every message lands in your inbox and your Formclick dashboard.

Built with Gatsby 5 and React 19.

## Quick start

1. Create a free account at [formclick.io](https://www.formclick.io), create a form and copy its **access key**.
2. Clone and install:
   ```bash
   git clone https://github.com/formclick/gatsby-contact-form.git
   cd gatsby-contact-form
   npm install
   ```
3. Copy `.env.example` to **both** `.env.development` and `.env.production`, and paste your key:
   ```bash
   GATSBY_FORMCLICK_ACCESS_KEY=your-access-key
   ```
4. Run `npm run develop`, open [localhost:8000](http://localhost:8000) and send a test message.

When you deploy, set `GATSBY_FORMCLICK_ACCESS_KEY` in your host's build environment.

## How it works

| File | Role |
| --- | --- |
| [`src/components/ContactForm.jsx`](src/components/ContactForm.jsx) | The form: posts JSON to Formclick and shows sending, error and thank-you states. |
| [`src/pages/index.jsx`](src/pages/index.jsx) | The page, with its `<title>` set through Gatsby's `Head` API. |
| [`src/pages/404.jsx`](src/pages/404.jsx) | A simple not-found page. |

```jsx
const ACCESS_KEY = process.env.GATSBY_FORMCLICK_ACCESS_KEY;

const res = await fetch('https://api.formclick.io/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ ...data, access_key: ACCESS_KEY }),
});
```

| Piece | Why it's there |
| --- | --- |
| `GATSBY_` prefix | Gatsby only exposes variables with this prefix to the browser, and loads them from `.env.development` (`gatsby develop`) and `.env.production` (`gatsby build`). |
| Client-side `fetch` | The request goes from the visitor's browser straight to Formclick, so the site stays fully static. |
| `new FormData(form)` | Collects every input with a `name`, so adding a field is all you need to send it. |
| `_honeypot` | A hidden spam trap. Bots fill it and those submissions are silently discarded. |
| `res.status === 429` | Formclick limits repeated submissions from one visitor; the form shows a friendly message. |

The access key can only create submissions, so it's safe to expose in the browser.

## Responses

| Status | Meaning |
| --- | --- |
| `200` | Saved and delivered. |
| `400` | Missing or invalid access key, empty submission, or a failed captcha. |
| `403` | Form disabled, website not on the form's allowed domains, or monthly limit reached. |
| `404` | No form exists for this access key. |
| `429` | Too many submissions from one visitor in a short time. |

## Learn more

- [Form API reference](https://www.formclick.io/form-api)
- [React (Vite) version](https://github.com/formclick/react-contact-form)
- [All Formclick examples](https://github.com/formclick/contact-form-examples)

## License

[MIT](LICENSE)
