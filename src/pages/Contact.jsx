import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Contact.css';

// Set VITE_CONTACT_ENDPOINT (e.g. a Formspree URL) to deliver messages; otherwise the form runs in demo mode.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;
// TODO: replace with your real inbox.
const CONTACT_EMAIL = 'hello@wils.news';
const MESSAGE_MAX = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const subjects = ['General question', 'Feedback', 'Partnership', 'Report a data issue', 'Press'];

const channels = [
  {
    icon: 'fa-solid fa-envelope',
    title: 'Email us',
    copy: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: 'fa-brands fa-discord',
    title: 'Join the community',
    copy: 'Chat with analysts and the WILS team',
    href: 'https://discord.com',
    external: true,
  },
  {
    icon: 'fa-brands fa-x-twitter',
    title: 'Follow updates',
    copy: 'Market alerts and product news',
    href: 'https://twitter.com',
    external: true,
  },
];

const faqs = [
  {
    q: 'Where does your market data come from?',
    a: 'Prices, market caps and charts are provided by the CoinGecko API and refresh every 30 seconds while the page is open.',
  },
  {
    q: 'Is WILS financial advice?',
    a: 'No. WILS is an information service. Always do your own research before making investment decisions.',
  },
  {
    q: 'How do I save coins to my watchlist?',
    a: 'Tap the star next to any asset on the Markets page or a coin page. Your watchlist is stored in this browser.',
  },
];

const initialForm = { name: '', email: '', subject: subjects[0], message: '', website: '' };

const validate = (data) => {
  const errors = {};
  if (data.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(data.email.trim())) errors.email = 'Please enter a valid email address.';
  if (data.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  if (data.message.length > MESSAGE_MAX) errors.message = `Message must be under ${MESSAGE_MAX} characters.`;
  return errors;
};

function Contact() {
  useDocumentTitle('Contact');
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const next = { ...formData, [e.target.name]: e.target.value };
    setFormData(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(formData);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    // Honeypot: real users never fill the hidden "website" field.
    if (formData.website) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    setServerError('');
    try {
      const { website, ...payload } = formData;
      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } else {
        // Demo mode – no backend configured.
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus('success');
      setFormData(initialForm);
      setTouched({});
    } catch (err) {
      setStatus('error');
      setServerError(err.message || 'Something went wrong.');
    }
  };

  const fieldError = (name) => (touched[name] ? errors[name] : undefined);
  const remaining = MESSAGE_MAX - formData.message.length;

  return (
    <div className="container">
      <div className="page-header contact-header">
        <div>
          <span className="eyebrow">Get in touch</span>
          <h1>Contact Us</h1>
          <p className="muted">Questions, feedback or partnership ideas? We&apos;d love to hear from you.</p>
        </div>
        <span className="response-badge">
          <i className="fa-regular fa-clock"></i> Replies within 1–2 business days
        </span>
      </div>

      <section className="contact-layout">
        {status === 'success' ? (
          <div className="form contact-success" role="status">
            <div className="success-icon">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2>Message sent!</h2>
            <p className="muted">
              Thanks for reaching out. We&apos;ll get back to you soon.
              {!CONTACT_ENDPOINT && ' (Demo mode – no message was actually delivered.)'}
            </p>
            <button className="btn secondary" onClick={() => setStatus('idle')}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className={`form-group ${fieldError('name') ? 'has-error' : ''}`}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldError('name'))}
                  aria-describedby={fieldError('name') ? 'name-error' : undefined}
                  placeholder="Your name"
                />
                {fieldError('name') && <span id="name-error" className="field-error">{errors.name}</span>}
              </div>
              <div className={`form-group ${fieldError('email') ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(fieldError('email'))}
                  aria-describedby={fieldError('email') ? 'email-error' : undefined}
                  placeholder="name@example.com"
                />
                {fieldError('email') && <span id="email-error" className="field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group form-spaced">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className={`form-group form-spaced ${fieldError('message') ? 'has-error' : ''}`}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={MESSAGE_MAX}
                aria-invalid={Boolean(fieldError('message'))}
                aria-describedby="message-hint"
                placeholder="How can we help?"
              />
              <div id="message-hint" className="field-hint">
                <span className="field-error">{fieldError('message')}</span>
                <span className={remaining < 100 ? 'counter warn' : 'counter'}>{remaining} characters left</span>
              </div>
            </div>

            {/* Honeypot field – hidden from users and screen readers */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
            </div>

            {status === 'error' && (
              <div className="form-alert" role="alert">
                <i className="fa-solid fa-circle-exclamation"></i>
                {serverError} Please try again or email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </div>
            )}

            <button className="btn" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Sending…
                </>
              ) : (
                <>
                  Send Message <i className="fa-solid fa-paper-plane"></i>
                </>
              )}
            </button>
          </form>
        )}

        <aside className="contact-aside">
          <div className="card">
            <div className="card-body">
              <h3>Other ways to reach us</h3>
              <ul className="channel-list">
                {channels.map((c) => (
                  <li key={c.title}>
                    <a
                      href={c.href}
                      className="channel"
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <span className="channel-icon"><i className={c.icon}></i></span>
                      <span>
                        <span className="channel-title">{c.title}</span>
                        <span className="channel-copy">{c.copy}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3>Frequently asked</h3>
              <div className="faq-list">
                {faqs.map((f) => (
                  <details key={f.q} className="faq">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Contact;
