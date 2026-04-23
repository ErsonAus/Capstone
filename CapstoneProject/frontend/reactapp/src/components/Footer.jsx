// Footer Component
// Footer component with company branding, contact information, and support links.
// Displays static footer content including company name, contact details, and policy links.

/**
 * Footer Component
 * Presentational component that displays the application footer
 * Contains three main sections: company info, contact details, and support links
 * This is a stateless component with no props or dynamic content
 * 
 * @returns {JSX.Element} Footer element with company and contact information
 */
function Footer() {
  /**
   * COMPONENT RENDER
   * Return the footer with semantic HTML footer element
   * Organized into three distinct blocks for company info, contact, and support
   */
  return (
    // Main footer element - semantic HTML5 element for page footer
    <footer className="footer-shell">
      
      {/* COMPANY INFORMATION BLOCK */}
      {/* First footer block containing company name and description */}
      <div className="footer-block">
        {/* Company name/branding heading */}
        <h2>Adventure Australia</h2>
        {/* Company tagline/mission statement */}
        <p>Professional travel planning for unforgettable Australian adventures.</p>
      </div>

      {/* CONTACT INFORMATION BLOCK */}
      {/* Second footer block containing contact details */}
      <div className="footer-block">
        {/* Contact section heading */}
        <h3>Contact</h3>
        {/* Unordered list of contact methods */}
        <ul>
          {/* Email contact with envelope emoji */}
          <li>✉️ booking@adventureau.com</li>
          {/* Phone contact with telephone emoji and Australian phone number */}
          <li>📞 +61 2 9000 1234</li>
          {/* Physical location with map pin emoji */}
          <li>📍 Sydney, Australia</li>
        </ul>
      </div>

      {/* SUPPORT AND POLICY BLOCK */}
      {/* Third footer block containing links to legal and support pages */}
      <div className="footer-block">
        {/* Support section heading */}
        <h3>Support</h3>
        {/* Unordered list of support-related links */}
        <ul>
          {/* Link to terms and conditions page */}
          <li>Terms & conditions</li>
          {/* Link to privacy policy page */}
          <li>Privacy policy</li>
          {/* Link to customer support/care page */}
          <li>Customer care</li>
        </ul>
      </div>
    </footer>
  )
}

// Export the Footer component as the default export
// This component is used globally on all pages requiring a footer
export default Footer