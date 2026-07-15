// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
let isDarkMode = true; // Default to dark as requested

function updateTheme() {
  if (isDarkMode) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
}

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  updateTheme();
});

// --- Language Toggle Logic ---
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'az';

function updateLanguage() {
  langToggle.innerText = currentLang === 'az' ? 'EN' : 'AZ';
  htmlElement.lang = currentLang;

  // Update static text elements
  document.querySelectorAll('[data-az]').forEach(el => {
    el.innerText = el.getAttribute(`data-${currentLang}`);
  });
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'az' ? 'en' : 'az';
  updateLanguage();
});

// --- Scroll Fade In Animation ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// --- WhatsApp Order Submission Logic ---
const orderForm = document.getElementById('order-form');

if (orderForm) {
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default page reload

    // Extract values from form inputs
    const name = document.getElementById('field-name').value.trim();
    const phone = document.getElementById('field-phone').value.trim();
    const car = document.getElementById('field-car').value.trim();
    const vin = document.getElementById('field-vin').value.trim();
    const parts = document.getElementById('field-parts').value.trim();

    // Construct the structured WhatsApp message
    const message = `*Yeni Sifariş! 🚘*\n\n` +
      `👤 *Müştəri:* ${name}\n` +
      `📞 *Əlaqə:* ${phone}\n` +
      `🏎️ *Avtomobil:* ${car}\n` +
      `🔢 *VIN Kod:* ${vin}\n\n` +
      `🛠️ *Tələb Olunan Hissələr:*\n${parts}`;

    // Target WhatsApp API number
    const targetNumber = '994508005433';

    // Encode the text safely for a URL
    const encodedMessage = encodeURIComponent(message);

    // Construct WhatsApp API URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodedMessage}`;

    // Open WhatsApp seamlessly in a new tab
    window.open(whatsappUrl, '_blank');
  });
}
