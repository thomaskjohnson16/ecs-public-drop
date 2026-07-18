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
    chatStatus.textContent = "Chat is not yet available. Please use the contact channels on this page.";
    chatComposer.disabled = true;
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
