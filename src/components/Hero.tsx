import { GraduationCap, FileText, Github, Linkedin, Mail, FlaskConical } from 'lucide-react';
import { profileData } from '../data/loadContent';

export default function Hero() {
  const { name, title, subtitle, tagline, headshot, cv, email, links, lab, stats } = profileData;
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <h1>{name}</h1>
            <p className="title">{title}</p>
            <p className="subtitle">{subtitle}</p>
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
              <a className="chip" href={`mailto:${email}`}><Mail size={16} /> Email</a>
              <a className="chip" href={links.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} /> GitHub
              </a>
              <a className="chip" href={links.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
          <img className="headshot" src={headshot} alt={`Portrait of ${name}`} />
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
