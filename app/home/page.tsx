import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About & Install",
  description: "Learn about the Ibani Bible app and how to install it on your mobile device.",
};

export default function HomeLandingPage() {
  return (
    <div className="home-landing">
      {/* Hero Section */}
      <section className="hero-landing" style={{ backgroundImage: `linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.85)), url('https://ibani.online/images/christian-joudrey-DuD5D3lWC3c-unsplash.jpg')` }}>
        <div className="hero-landing__content">
          <h1 className="hero-landing__title">Ibani Bible Online</h1>
          <p className="hero-landing__subtitle">Read the New Testament in the Ibani language, beautifully designed for web and mobile.</p>
          <div className="hero-landing__actions">
            <Link href="/" className="hero-landing__btn hero-landing__btn--primary">Start Reading</Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="landing-content">
        <section className="landing-section">
          <h2 className="landing-section__title">About the App</h2>
          <p>
            Welcome to <strong>Ibani Bible Online</strong>. This app provides free and accessible access to the New Testament translated into the Ibani language. Designed for both desktop and mobile, you can read verses with a side-by-side English translation to assist your understanding and study.
          </p>
        </section>

        <section className="landing-section">
          <h2 className="landing-section__title">How to Use</h2>
          <ul className="landing-features">
            <li>
              <strong>📖 Navigation</strong> 
              Use the &quot;Books&quot; dropdown in the header to select any book of the New Testament. Easily jump between chapters using the arrows at the bottom of each page.
            </li>
            <li>
              <strong>🌗 Reading Modes</strong> 
              Toggle between &quot;Ibani Only&quot; and &quot;Side-by-Side&quot; (Ibani & English) while reading chapters to suit your preference.
            </li>
            <li>
              <strong>⚙️ Customization</strong> 
              Adjust the text size (the A<span style={{fontSize:'0.8em'}}>A</span> button) and switch between Dark and Light mode (the 🌙/☀️ button) using the icons at the top right of the navigation bar.
            </li>
            <li>
              <strong>🖼️ Share Verses</strong> 
              Click on any verse to open the share menu. You can generate a beautifully styled image of the verse, perfect for sharing on social media or with friends!
            </li>
          </ul>
        </section>

        <section className="landing-section install-section">
          <h2 className="landing-section__title">Download as a Mobile App</h2>
          <p>You can install the Ibani Bible directly to your phone&apos;s home screen for quick access and a true app-like experience (it even works offline!).</p>
          
          <div className="install-grid">
            <div className="install-card">
              <h3>📱 iPhone & iPad (Safari)</h3>
              <ol>
                <li>Open <strong>bible.ibani.online</strong> in Safari.</li>
                <li>Tap the <strong>Share</strong> button (the square with an arrow pointing up at the bottom of the screen).</li>
                <li>Scroll down the share menu and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top right corner.</li>
              </ol>
            </div>
            
            <div className="install-card">
              <h3>📱 Android (Chrome)</h3>
              <ol>
                <li>Open <strong>bible.ibani.online</strong> in Google Chrome.</li>
                <li>Tap the <strong>Menu</strong> icon (3 dots in the upper right corner).</li>
                <li>Tap <strong>Add to Home screen</strong> or <strong>Install app</strong>.</li>
                <li>Follow the on-screen prompt to add it to your device.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
