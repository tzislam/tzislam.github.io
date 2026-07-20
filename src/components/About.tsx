import { profileData } from '../data/loadContent';

export default function About() {
  const { bio, bwcse } = profileData;
  return (
    <section className="section" id="about">
      <div className="container">
        <p className="eyebrow">About</p>
        <h2>Bio</h2>
        <div className="prose">
          {bio.map((para, i) => (
            <p key={i}>
              {para}
              {i === bio.length - 1 && (
                <>
                  {' '}
                  <a href={bwcse} target="_blank" rel="noopener noreferrer">Learn more about BWCSE ↗</a>
                </>
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
