import { Component } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Scene from '../three/Scene';

class SceneErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function ActionButton({ children, onClick, light = false }) {
  return <button className={`landing-action${light ? ' landing-action-light' : ''}`} onClick={onClick}>{children}<span aria-hidden="true">&gt;</span></button>;
}

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const goToApp = () => navigate(user ? '/dashboard' : '/register');

  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-scene"><SceneErrorBoundary><Scene /></SceneErrorBoundary></div>
        <div className="landing-vignette" />
        <nav className="landing-nav"><a className="landing-brand" href="/">Amass<span>.</span></a><div className="landing-links"><a href="#how">How it works</a><a href="#features">Features</a></div><ActionButton onClick={goToApp}>{user ? 'Dashboard' : 'Get started'}</ActionButton></nav>
        <motion.div className="landing-hero-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35 }}>
          <p className="hero-kicker">Personal finance, made tangible</p>
          <h1 id="landing-title">Your Money,<br /><em>Your Future.</em></h1>
          <p className="hero-copy">A calmer way to see every transaction, make room for what matters, and turn small decisions into lasting momentum.</p>
          <ActionButton onClick={goToApp}>{user ? 'Go to dashboard' : 'Get started'}</ActionButton>
        </motion.div>
        <div className="landing-scroll-note">Scroll to explore <span>↓</span></div>
      </section>

      <motion.section id="how" className="landing-section how-section" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
        <div className="landing-section-heading"><p className="section-eyebrow">How it works</p><h2>A clear view changes<br /><em>what you do next.</em></h2><p>Amass turns the daily noise of personal finance into a simple rhythm you can actually keep.</p></div>
        <div id="features" className="feature-grid">
          <article className="card feature-card"><span className="feature-mark">01</span><span>01 / Log</span><h3>Fast logging</h3><p>Capture spending while it is still fresh, with less friction between you and the truth.</p></article>
          <article className="card feature-card feature-card-accent"><span className="feature-mark">02</span><span>02 / Guide</span><h3>Thoughtful budgets</h3><p>Give each part of your month a boundary that helps you spend with intention.</p></article>
          <article className="card feature-card"><span className="feature-mark">03</span><span>03 / Build</span><h3>Savings goals</h3><p>Make progress visible and turn a distant goal into a series of achievable steps.</p></article>
          <article className="card feature-card feature-card-wide"><span className="feature-mark">04</span><span>04 / Understand</span><h3>Useful reports</h3><p>See the patterns behind your money, so your next decision starts with context instead of guesswork.</p></article>
        </div>
      </motion.section>

      <motion.section className="landing-final-cta" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }}><p className="section-eyebrow">Begin with today</p><h2>Make your money<br /><em>feel less mysterious.</em></h2><p>Track today. Save consistently. Understand your money.</p><ActionButton light onClick={goToApp}>{user ? 'Go to dashboard' : 'Get started'}</ActionButton></motion.section>
      <footer className="landing-footer-simple"><span>Amass<span>.</span></span><small>Personal finance, made clear.</small></footer>
    </main>
  );
}
