import { ArrowRight } from 'lucide-react';
import { profileData } from '../data/loadContent';

export default function LabBlurb() {
  const { labBlurb, lab } = profileData;
  return (
    <section className="section" id="lab">
      <div className="container">
        <div className="labcard">
          <p className="eyebrow">Per4ML Laboratory</p>
          <h2>Building intelligent, scalable HPC systems</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.4rem' }}>{labBlurb}</p>
          <a className="cta-btn" href={lab.url} target="_blank" rel="noopener noreferrer">
            Explore the Per4ML Lab <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
