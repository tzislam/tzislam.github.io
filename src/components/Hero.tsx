import { GraduationCap, FileText, Github, Linkedin, Mail, FlaskConical } from 'lucide-react';
import { profileData } from '../data/loadContent';

export default function Hero() {
  const { name, credential, roles, tagline, headshot, cv, email, links, lab, stats } = profileData;
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-lead">
            <h1 className="hero-name">{name}</h1>
            <hr className="hero-rule" />

            <div className="roles">
              {credential && <p className="credential">{credential}</p>}
              {roles.map((r) => (
                <p className="role" key={r.role}>
                  <span className="role-title">{r.role}</span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">{r.org}</a>
                </p>
              ))}
              <p className="role role-contact">
                <Mail size={15} /> <a href={`mailto:${email}`}>{email}</a>
              </p>
            </div>

            <p className="tagline">{tagline}</p>

            <div className="quicklinks">
              <a className="chip primary" href={lab.url} target="_blank" rel="noopener noreferrer">
                <FlaskConical size={16} /> Per4ML Lab
              </a>
              <a className="chip" href={cv}><FileText size={16} /> CV</a>
              <a className="chip" href={links.scholar} target="_blank" rel="noopener noreferrer">
                <GraduationCap size={16} /> Scholar
              </a>
              <a className="chip" href={links.dblp} target="_blank" rel="noopener noreferrer">DBLP</a>
              <a className="chip" href={links.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} /> GitHub
              </a>
              <a className="chip" href={links.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>

          <div className="hero-cards">
            {/* Logo card — swap the text below for <img src="/per4ml-logo.png" /> when the asset is added */}
            <a className="logo-card" href={lab.url} target="_blank" rel="noopener noreferrer">
              <span className="logo-mark">Per4<span className="logo-accent">ML</span></span>
              <span className="logo-sub">Laboratory</span>
            </a>
            <img className="headshot" src={headshot} alt={`Portrait of ${name}`} />
          </div>
        </div>

        <div className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="val">{s.value}</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
