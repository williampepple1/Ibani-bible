export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <p className="footer__text">
          <span className="footer__brand">Ibani Bible</span> — The New Testament in the Ibani language.
          <br />
          © {new Date().getFullYear()} Ibani Bible Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
