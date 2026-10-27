/* Central settings for MomProduct.com — edit ONLY this file to change contact details, prices or the form endpoint. */
window.MP = {
  brand: "MomProduct",
  company: "MomProduct Technologies",
  tagline: "Your Website. Live in 24 Hours. Affordably.",

  /* Delivery promise. The clock starts once we have your content, the confirmed quote and the advance payment. */
  deliveryHours: 24,
  deliveryNote: "24-hour delivery starts when we have your content (text, logo, photos), your confirmed quote and the advance payment. Larger or custom projects get their own timeline in the quotation.",
  siteUrl: "https://momproduct.com",

  /* Verified contact details supplied by the owner. */
  email: "amandotnetprofessional@gmail.com",
  phoneDisplay: "+91 90238 23090",
  phoneTel: "+919023823090",
  phone2Display: "+91 97375 19481",
  phone2Tel: "+919737519481",
  whatsappNumber: "919023823090", // international format, digits only, no "+"

  whatsappMessage:
    "Hi MomProduct, I want a website delivered in 24 hours. Please share your packages and pricing.",

  /* Enquiry form delivery via Web3Forms (emails go to the address the key was registered with).
     The access key is designed to be public — it is not a password. */
  formEndpoint: "https://api.web3forms.com/submit",
  web3formsKey: "fcce3e3d-25f3-4ef8-b982-643e3d288e6d",

  /* Launch prices as confirmed by the owner. */
  packages: [
    {
      id: "starter",
      delivery: "Delivered in 24 hours",
      name: "Starter Website",
      price: "₹2,999",
      scope: "One-page website",
      blurb: "A clean single page to get your business found and contacted.",
      features: [
        "1 responsive page (up to 5 sections)",
        "Mobile-friendly design",
        "WhatsApp, call & email buttons",
        "Contact / enquiry form",
        "Basic SEO setup",
        "1 round of revisions"
      ],
      limits: ["Single page only", "No blog or CMS"],
      featured: false
    },
    {
      id: "business",
      delivery: "Delivered in 24 hours",
      name: "Business Website",
      price: "₹5,999",
      scope: "Up to 5 pages",
      blurb: "The right size for most small businesses and professionals.",
      features: [
        "Up to 5 pages (Home, About, Services, Gallery, Contact)",
        "Custom colours & layout",
        "Enquiry form with email delivery",
        "Google Maps & social links",
        "On-page SEO & sitemap",
        "2 rounds of revisions"
      ],
      limits: ["Content supplied by you", "No online payments"],
      featured: true
    },
    {
      id: "plus",
      delivery: "Delivered in 24 hours",
      name: "Business Plus",
      price: "₹9,999",
      scope: "Approx. 8–10 pages",
      blurb: "For growing businesses that need more pages and more polish.",
      features: [
        "Approx. 8–10 pages",
        "Service / product detail pages",
        "Photo gallery or portfolio",
        "Blog-ready structure",
        "Advanced SEO & analytics setup",
        "3 rounds of revisions"
      ],
      limits: ["No e-commerce or logins", "Custom features quoted separately"],
      featured: false
    }
  ]
};

MP.waLink = function (msg) {
  return "https://wa.me/" + MP.whatsappNumber + "?text=" + encodeURIComponent(msg || MP.whatsappMessage);
};
MP.telLink = "tel:" + MP.phoneTel;
MP.tel2Link = "tel:" + MP.phone2Tel;
MP.mailLink = "mailto:" + MP.email;
