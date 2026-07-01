export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <p className="footer__text">
          <span className="footer__brand">Ibani Bible</span> — The New Testament in the Ibani language.
          <br />
          © {new Date().getFullYear()} Ibani Bible Project. All rights reserved.
          <br />
          <br />
          Text: © 2024 Luke Initiative for Scripture Translation
          <br />
          Audio: ℗ Hosanna, 2024
        </p>
      </div>
    </footer>
  );
}
