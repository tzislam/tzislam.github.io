import { profileData } from '../data/loadContent';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {year} {profileData.name}</span>
        <span>
          <a href="https://www.tanzimaislam.com">www.tanzimaislam.com</a>
          {' · '}
          <a href={profileData.lab.url} target="_blank" rel="noopener noreferrer">Per4ML Lab ↗</a>
          {' · '}
          <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
        </span>
      </div>
    </footer>
  );
}
