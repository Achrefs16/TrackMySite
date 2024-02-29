import React from "react";

function FooterSection() {
  return (
    <div className="bg-slate-900 flex p-28 justify-between text-white">
      <div class="quick-links">
        <h3 className="font-medium text-2xl pb-6 text-brand">Quick Links</h3>
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about-us">About Us</a>
          </li>
          <li>
            <a href="/features">Features</a>
          </li>
          <li>
            <a href="/pricing">Pricing</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
      <div class="contact-info">
        <h3 className="font-medium text-2xl text-brand pb-6">Get in Touch</h3>
        <p>Email: support@example.com</p>
        <p>Support Hotline: +1 234 567 8900</p>
      </div>
      <div class="social-media">
        <h3 className="font-medium text-2xl pb-6 text-brand">
          Connect With Us
        </h3>
        <a href="https://www.facebook.com/yourprofile">Facebook</a>
        <br />
        <a href="https://www.twitter.com/yourprofile">Twitter</a>
        <br />
        <a href="https://www.instagram.com/yourprofile">Instagram</a>
      </div>
      <div class="legal-links">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-of-service">Terms of Service</a>
      </div>
    </div>
  );
}

export default FooterSection;
