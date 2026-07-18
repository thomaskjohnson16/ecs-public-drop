const config = window.ECS_SITE_CONFIG || {};
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const contactConfigNodes = document.querySelectorAll("[data-config-key]");
const contactLinkNodes = document.querySelectorAll("[data-config-link]");
const chatOpenButton = document.querySelector("#chatOpenButton");
const chatDialog = document.querySelector("#chatDialog");
const chatCloseButton = document.querySelector("#chatCloseButton");
const chatStatus = document.querySelector("#chatStatus");
const chatComposer = document.querySelector("#chatComposer");
const chatSendButton = document.querySelector("#chatSendButton");
const skipLink = document.querySelector(".skip-link");
const mainContent = document.querySelector("#mainContent");

function hasConfiguredStringValue(key) {
  return typeof config[key] === "string" && config[key].trim().length > 0;
}

function readConfigValue(key, fallbackLabel) {
  if (hasConfiguredStringValue(key)) {
    return config[key].trim();
  }

  return fallbackLabel || `[${key}]`;
}

function isPlaceholderValue(value) {
  return value.startsWith("[") && value.endsWith("]");
}

function buildLinkHref(type, value) {
  if (type === "mailto") {
    return `mailto:${value}`;
  }

  if (type === "tel") {
    const digits = value.replace(/\D/g, "");
    const internationalNumber = digits.length === 10 ? `+1${digits}` : `+${digits}`;
    return `tel:${internationalNumber}`;
  }

  return value;
}

function loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = href;
  document.head.appendChild(stylesheet);
}

loadStylesheet("css/polish.css");

contactConfigNodes.forEach((node) => {
  const key = node.dataset.configKey || "";
  const fallbackLabel = node.dataset.emptyLabel || `[${key}]`;
  const value = readConfigValue(key, fallbackLabel);

  node.textContent = value;

  if (!hasConfiguredStringValue(key) || isPlaceholderValue(value)) {
    node.classList.add("is-placeholder");
  }
});

contactLinkNodes.forEach((node) => {
  const key = node.dataset.configLink || "";
  const linkType = node.dataset.linkType || "url";
  const fallbackLabel = node.dataset.emptyLabel || `[${key}]`;
  const value = readConfigValue(key, fallbackLabel);
  const hasValue = hasConfiguredStringValue(key);

  node.textContent = value;

  if (!hasValue || isPlaceholderValue(value)) {
    node.classList.add("is-placeholder");
    node.setAttribute("href", "#");
    node.setAttribute("aria-disabled", "true");
    node.addEventListener("click", (event) => event.preventDefault());
    return;
  }

  node.setAttribute("href", buildLinkHref(linkType, value));
  node.removeAttribute("aria-disabled");
});

function addPublicContactAccess() {
  const contactEmail = readConfigValue("publicContactEmail", "Contact@executiveculturesolutions.com");
  const intakeEmail = readConfigValue("intakeEmail", "Intake@executiveculturesolutions.com");
  const phone = readConfigValue("businessPhone", "(910) 315-0436");

  loadStylesheet("css/contact-access.css");

  const ribbon = document.createElement("div");
  ribbon.className = "ecs-contact-ribbon";
  ribbon.setAttribute("aria-label", "ECS public contact information");
  ribbon.innerHTML = `
    <div class="ecs-contact-ribbon__inner">
      <a href="${buildLinkHref("mailto", contactEmail)}">${contactEmail}</a>
      <a href="${buildLinkHref("mailto", intakeEmail)}">${intakeEmail}</a>
      <a href="${buildLinkHref("tel", phone)}">${phone}</a>
    </div>`;

  const header = document.querySelector(".site-header");
  if (header) {
    header.insertAdjacentElement("beforebegin", ribbon);
  } else {
    document.body.insertAdjacentElement("afterbegin", ribbon);
  }

  const mobileBar = document.createElement("nav");
  mobileBar.className = "ecs-mobile-contact-bar";
  mobileBar.setAttribute("aria-label", "Quick contact");
  mobileBar.innerHTML = `
    <a href="${buildLinkHref("tel", phone)}">Call ECS</a>
    <a href="${buildLinkHref("mailto", contactEmail)}">Email ECS</a>
    <a href="${buildLinkHref("mailto", intakeEmail)}">Client Intake</a>`;
  document.body.appendChild(mobileBar);
}

addPublicContactAccess();

if (skipLink && mainContent) {
  skipLink.addEventListener("click", () => {
    requestAnimationFrame(() => {
      mainContent.focus();
    });
  });
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (chatOpenButton && chatDialog && chatStatus && chatComposer && chatSendButton) {
  const endpointValue = readConfigValue("chatbotEndpoint", "[chatbotEndpoint]");
  const chatEnabled = Boolean(config.chatbotEnabled);

  if (!chatEnabled) {
    chatOpenButton.disabled = true;
    chatOpenButton.setAttribute("aria-disabled", "true");
    chatOpenButton.setAttribute("aria-expanded", "false");
    chatOpenButton.textContent = "ECS Live Chat — Coming Soon";
    chatStatus.textContent = "Live chat is being prepared. Use the contact or client-intake channels for immediate assistance.";
    chatComposer.disabled = true;
    chatComposer.placeholder = "Live chat is not yet active.";
    chatSendButton.disabled = true;
  }

  const closeChat = () => {
    chatDialog.hidden = true;
    chatOpenButton.setAttribute("aria-expanded", "false");
    chatOpenButton.focus();
  };

  const openChat = () => {
    if (!chatEnabled) {
      return;
    }

    chatDialog.hidden = false;
    chatOpenButton.setAttribute("aria-expanded", "true");
    chatComposer.focus();

    if (isPlaceholderValue(endpointValue)) {
      chatStatus.textContent = "Chat shell enabled, but no verified endpoint is configured yet.";
      chatComposer.disabled = true;
      chatSendButton.disabled = true;
    }
  };

  chatOpenButton.addEventListener("click", openChat);

  if (chatCloseButton) {
    chatCloseButton.addEventListener("click", closeChat);
  }

  chatDialog.addEventListener("click", (event) => {
    if (event.target === chatDialog) {
      closeChat();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !chatDialog.hidden) {
      closeChat();
    }
  });
}
