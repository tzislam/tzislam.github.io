import { Mail, FileText, FlaskConical } from 'lucide-react';
import { profileData } from '../data/loadContent';

export default function Contact() {
  const { email, office, cv, lab } = profileData;
  return (
    <section className="section" id="contact">
      <div className="container">
        <p className="eyebrow">Contact</p>
        <h2>Get in touch</h2>
        <p className="prose">
          {office}. Prospective students: I recruit through the Per4ML Lab — please read the lab
          site, then reach out by email.
        </p>
        <div className="contact-row">
          <a className="chip primary" href={`mailto:${email}`}><Mail size={16} /> {email}</a>
          <a className="chip" href={cv}><FileText size={16} /> Download CV</a>
          <a className="chip" href={lab.url} target="_blank" rel="noopener noreferrer">
            <FlaskConical size={16} /> Join the Lab
          </a>
        </div>
      </div>
    </section>
  );
}
