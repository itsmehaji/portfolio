(function () {
  const iconReady = window.lucide && typeof window.lucide.createIcons === "function";
  if (iconReady) {
    try {
      window.lucide.createIcons();
    } catch (error) {
      // Keep the rest of the page working if an icon name is unavailable.
    }
  }

  const themeToggle = document.querySelector(".theme-toggle");
  const themeLabel = themeToggle ? themeToggle.querySelector("span") : null;
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
  const themeKey = "theme";
  const root = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem(themeKey);
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(themeKey, theme);
    } catch (error) {
      // Ignore storage failures on file:// or restricted contexts.
    }
  }

  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");
  const emailTo = "mohammadhaji744@gmail.com";

  const validators = {
    name(value) {
      if (!value.trim()) return "Please enter your name.";
      if (value.trim().length < 2) return "Name should be at least 2 characters.";
      return "";
    },
    email(value) {
      if (!value.trim()) return "Please enter your email.";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
      return "";
    },
    message(value) {
      if (!value.trim()) return "Please write a message.";
      if (value.trim().length < 12) return "Message should be at least 12 characters.";
      return "";
    }
  };

  function setFieldError(field, message) {
    const row = field.closest(".form-row");
    const error = document.querySelector(`[data-error-for="${field.name}"]`);

    row.classList.toggle("has-error", Boolean(message));
    error.textContent = message;
  }

  function validateForm(formData) {
    let isValid = true;

    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      const message = validators[name](formData.get(name) || "");
      setFieldError(field, message);

      if (message) {
        isValid = false;
      }
    });

    return isValid;
  }

  function buildMailto(formData) {
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    return `mailto:${emailTo}?subject=${subject}&body=${body}`;
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    setStoredTheme(theme);

    if (!themeToggle || !themeLabel || !themeIcon) {
      return;
    }

    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Enable light mode" : "Enable dark mode");
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
    themeIcon.setAttribute("data-lucide", isDark ? "sun-medium" : "moon-star");

    if (iconReady) {
      window.lucide.createIcons();
    }
  }

  function getInitialTheme() {
    const storedTheme = getStoredTheme();
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  applyTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  form.addEventListener("input", (event) => {
    const field = event.target;
    if (!validators[field.name]) return;

    const message = validators[field.name](field.value);
    setFieldError(field, message);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    if (!validateForm(formData)) {
      status.textContent = "Please fix the highlighted fields.";
      return;
    }

    status.textContent = "Opening your email app with the message prepared.";
    window.location.href = buildMailto(formData);
    form.reset();
  });
})();
