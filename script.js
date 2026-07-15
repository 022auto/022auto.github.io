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
const phoneInput = document.getElementById('order-phone');

if (phoneInput) {
  // Auto-fill on focus if empty
  phoneInput.addEventListener('focus', function (e) {
    if (e.target.value.trim() === '') {
      e.target.value = '+994';
    }
  });

  // Clear on blur if only '+994' is present
  phoneInput.addEventListener('blur', function (e) {
    if (e.target.value.trim() === '+994') {
      e.target.value = '';
    }
  });

  // Live filtering: Enforce '+994' prefix and strip non-numeric characters
  phoneInput.addEventListener('input', function (e) {
    let value = e.target.value;
    
    // If the value doesn't start with '+994', force it
    if (!value.startsWith('+994')) {
      // Extract numbers they might have typed/pasted
      let numbersOnly = value.replace(/[^\d]/g, '');
      // Prevent duplication of '994' if they pasted a full number
      if (numbersOnly.startsWith('994')) {
        numbersOnly = numbersOnly.substring(3);
      }
      value = '+994' + numbersOnly;
    }
    
    // Keep '+994' intact and strictly allow only digits after it
    const prefix = '+994';
    const remainder = value.substring(prefix.length).replace(/[^\d]/g, '');
    
    e.target.value = prefix + remainder;
  });
}

const vinInput = document.getElementById('order-vin');

if (vinInput) {
  // Live filtering: Only allow alphanumeric characters and force uppercase
  vinInput.addEventListener('input', function (e) {
    let value = e.target.value;
    
    // Strip everything that is not a letter or digit
    value = value.replace(/[^A-Za-z0-9]/g, '');
    
    // Convert to uppercase instantly
    value = value.toUpperCase();
    
    // Update the input field visually
    e.target.value = value;
  });
}

if (orderForm) {
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default page reload

    // Extract values from form inputs
    const name = document.getElementById('field-name').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const car = document.getElementById('field-car').value.trim();
    const vin = document.getElementById('order-vin').value.trim().toUpperCase(); // Fetching via the updated ID
    const parts = document.getElementById('field-parts').value.trim();

    // Double-check VIN Code validity (strictly 17 alphanumeric characters)
    const vinRegex = /^[A-Za-z0-9]{17}$/;
    if (!vinRegex.test(vin)) {
      alert("Zəhmət olmasa VIN kodu düzgün daxil edin. VIN kod tam 17 simvoldan (hərf və rəqəm) ibarət olmalıdır!");
      return;
    }

    // Double-check Phone validity before submission
    const phoneRegex = /^\+?[0-9]{12}$/;
    if (!phoneRegex.test(phone)) {
      alert("Zəhmət olmasa telefon nömrəsini düzgün daxil edin (Məs: +994508005433).");
      return;
    }

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
