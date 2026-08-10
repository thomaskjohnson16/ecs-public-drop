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

const CHAT_SAFETY_NOTICE = "I’m the automated ECS website assistant. I can provide general business information and help route you to the right ECS starting point. I do not provide legal advice or evaluate employee complaints. Please do not enter names, medical information, allegations, personnel records, privileged material, credentials, or other sensitive case details.";

const sensitivePattern = /(social security|ssn|credit card|card number|password|credential|medical|diagnos|accommodation|employee name|personnel file|privileged|lawsuit|litigation|harass|discriminat|retaliat|complaint details|witness|victim|accused|threat of violence|self[- ]?harm)/i;
const legalAdvicePattern = /(legal advice|is this legal|illegal|violation|liable|liability|should i sue|attorney|lawyer|eeoc charge|file a charge|credibility|finding of fact|investigation strategy|disciplin|terminate|termination)/i;
const emergencyPattern = /(immediate danger|emergency|active threat|weapon|violence right now|suicide|kill myself|kill someone)/i;

const localAnswers = [
  {
    test: /(briefing|executive workforce risk briefing|where do i start|start)/i,
    answer: "The Executive Workforce Risk Briefing is the recommended starting point for most prospective clients. It gives leaders a structured executive view of workforce-governance, accountability, documentation, complaint-response, and escalation-risk indicators. I can also route you to ECS by email or phone."
  },
  {
    test: /(diagnostic|sprint|assessment)/i,
    answer: "The Workforce Governance Diagnostic Sprint is a more structured review for organizations that need deeper visibility into governance controls, leadership accountability, documentation posture, and process gaps. ECS can determine fit after an initial discussion or Briefing."
  },
  {
    test: /(retainer|ongoing|monthly|advisory support)/i,
    answer: "ECS may provide ongoing workforce-governance advisory support after fit and scope are confirmed. The website assistant does not create an engagement or commit ECS to recurring services; ECS staff will confirm scope and terms."
  },
  {
    test: /(product drop|template|checklist|resource)/i,
    answer: "ECS develops controlled reusable governance resources such as briefing aids, checklists, decision-packet templates, and educational assets. Availability depends on the approved product set."
  },
  {
    test: /(service|what do you do|what does ecs do|help with)/i,
    answer: "ECS is a Workforce Governance & Organizational Risk Advisory Group. Core work centers on executive workforce-risk visibility, leadership accountability, escalation governance, documentation discipline, and structured decision support. The Executive Workforce Risk Briefing is the primary starting point."
  },
  {
    test: /(who do you serve|company size|employees|client|industry)/i,
    answer: "ECS is primarily oriented toward private-sector organizations with roughly 50–500 employees, including CEOs, COOs, senior HR leaders, risk/compliance leaders, and counsel-facing leadership teams."
  },
  {
    test: /(price|pricing|cost|fee|rate|discount)/i,
    answer: "The website assistant does not quote custom pricing, discounts, or engagement terms. ECS staff will confirm current pricing and scope after the appropriate initial conversation."
  },
  {
    test: /(contact|email|phone|human|person|talk to someone)/i,
    answer: `You can reach ECS at ${readConfigValue("publicContactEmail", "Contact@executiveculturesolutions.com")} or ${readConfigValue("businessPhone", "(910) 315-0436")}. For active engagement intake, use ${readConfigValue("intakeEmail", "Intake@executiveculturesolutions.com")}. Please do not send sensitive employee or case material unless ECS has provided an approved channel and instructions.`
  },
  {
    test: /(hello|hi|hey|good morning|good afternoon|good evening)/i,
    answer: "Welcome to Executive Culture Solutions. I can explain ECS services, help you identify the appropriate starting point, or route you to a person. Most prospective clients start with the Executive Workforce Risk Briefing."
  }
];

function answerLocally(message) {
  const text = message.trim();

  if (emergencyPattern.test(text)) {
    return "ECS chat is not an emergency or safety-reporting service. If there is an immediate safety emergency, use the appropriate local emergency channel. Do not submit sensitive case details here.";
  }

  if (sensitivePattern.test(text) || legalAdvicePattern.test(text)) {
    return "I can provide general information about ECS, but I can’t evaluate a complaint, make legal or compliance determinations, assess credibility, recommend discipline, or receive sensitive case details. Please remove names and protected details. For general ECS service questions I can continue, or you can contact ECS directly for a bounded business discussion.";
  }

  const match = localAnswers.find((entry) => entry.test.test(text));
  if (match) {
    return match.answer;
  }

  return `I don’t have enough approved information to answer that reliably. I can help with the Executive Workforce Risk Briefing, ECS service navigation, who ECS serves, or contact routing. You can also reach ECS at ${readConfigValue("publicContactEmail", "Contact@executiveculturesolutions.com")}.`;
}

function createChatMessage(role, text, messageLog) {
  const item = document.createElement("div");
  item.className = `ecs-chat-message ecs-chat-message--${role}`;
  item.setAttribute("data-chat-role", role);

  const label = document.createElement("strong");
  label.textContent = role === "user" ? "You" : "ECS Assistant";

  const body = document.createElement("p");
  body.textContent = text;

  item.append(label, body);
  messageLog.appendChild(item);
  messageLog.scrollTop = messageLog.scrollHeight;
}

async function requestRemoteAnswer(message, sessionId) {
  const endpoint = readConfigValue("chatbotEndpoint", "");
  if (!endpoint || isPlaceholderValue(endpoint)) {
    return null;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "ecs-website",
        sessionId,
        message,
        page: window.location.pathname
      }),
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!payload || typeof payload.reply !== "string") {
      return null;
    }

    const reply = payload.reply.trim();
    if (!reply || reply.length > 2400) {
      return null;
    }

    return reply;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

if (chatOpenButton && chatDialog && chatStatus && chatComposer && chatSendButton) {
  const chatEnabled = Boolean(config.chatbotEnabled);
  const maxMessageLength = Number.isFinite(Number(config.chatbotMaxMessageLength))
    ? Math.max(200, Math.min(Number(config.chatbotMaxMessageLength), 2000))
    : 1200;
  const sessionId = globalThis.crypto?.randomUUID?.() || `ecs-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const shellCard = document.querySelector(".chatbot-shell-card");
  const shellHeading = shellCard?.querySelector("h2");
  const shellDescription = shellCard?.querySelector("p:not(.eyebrow)");
  const privacyText = chatDialog.querySelector(".chatbot-privacy");
  const greeting = chatDialog.querySelector(".chatbot-greeting");
  const intakeLinks = chatDialog.querySelectorAll('[data-config-link="intakeEmail"]');

  if (shellHeading) {
    shellHeading.textContent = chatEnabled ? "Ask the ECS website assistant." : "ECS chat — coming soon.";
  }
  if (shellDescription) {
    shellDescription.textContent = chatEnabled
      ? "Get general ECS information, service navigation, and contact routing. Do not submit sensitive employee or case details."
      : "The ECS live chat channel is not yet available. Use the contact channels above for inquiries.";
  }

  chatOpenButton.disabled = !chatEnabled;
  chatOpenButton.setAttribute("aria-disabled", String(!chatEnabled));
  chatOpenButton.setAttribute("aria-expanded", "false");
  chatOpenButton.textContent = chatEnabled ? "Open ECS Assistant" : "ECS Live Chat — Coming Soon";
  chatComposer.disabled = !chatEnabled;
  chatComposer.maxLength = maxMessageLength;
  chatComposer.placeholder = chatEnabled ? "Ask a general ECS business question…" : "Live chat is not yet active.";
  chatSendButton.disabled = !chatEnabled;

  if (chatEnabled) {
    intakeLinks.forEach((link) => {
      link.textContent = "Human Contact";
      link.dataset.configLink = "publicContactEmail";
      link.setAttribute("href", buildLinkHref("mailto", readConfigValue("publicContactEmail", "Contact@executiveculturesolutions.com")));
    });

    if (greeting) {
      greeting.textContent = "Welcome. I can help you understand ECS and identify the right starting point.";
    }

    chatStatus.textContent = "Automated assistant • general business information only • no legal advice or sensitive case intake.";
    if (privacyText) {
      privacyText.textContent = "Do not submit employee names, allegations, medical or accommodation information, personnel files, privileged material, passwords, credentials, payment-card data, or other sensitive case details. Chat use does not create an advisory, legal, or privileged relationship.";
    }

    const messageLog = document.createElement("div");
    messageLog.className = "ecs-chat-log";
    messageLog.id = "ecsChatLog";
    messageLog.setAttribute("role", "log");
    messageLog.setAttribute("aria-live", "polite");
    messageLog.setAttribute("aria-label", "ECS assistant conversation");
    messageLog.style.cssText = "max-height:260px;overflow:auto;margin:14px 0;padding:12px;border:1px solid #d9e1eb;border-radius:10px;background:#f6f8fb;display:grid;gap:10px;";

    const quickActions = document.createElement("div");
    quickActions.className = "ecs-chat-quick-actions";
    quickActions.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px;";

    [
      ["Start with the Briefing", "Tell me about the Executive Workforce Risk Briefing."],
      ["What does ECS do?", "What services does ECS provide?"],
      ["Talk to a person", "How do I contact ECS?" ]
    ].forEach(([labelText, prompt]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-secondary";
      button.textContent = labelText;
      button.style.cssText = "min-height:38px;padding:8px 12px;font-size:.8rem;";
      button.addEventListener("click", () => {
        chatComposer.value = prompt;
        chatComposer.focus();
      });
      quickActions.appendChild(button);
    });

    chatStatus.insertAdjacentElement("afterend", messageLog);
    messageLog.insertAdjacentElement("afterend", quickActions);
    createChatMessage("assistant", CHAT_SAFETY_NOTICE, messageLog);

    const submitMessage = async () => {
      const raw = chatComposer.value;
      const message = raw.trim();
      if (!message) {
        return;
      }

      chatComposer.value = "";
      chatSendButton.disabled = true;
      createChatMessage("user", message, messageLog);

      if (emergencyPattern.test(message) || sensitivePattern.test(message) || legalAdvicePattern.test(message)) {
        createChatMessage("assistant", answerLocally(message), messageLog);
        chatSendButton.disabled = false;
        chatComposer.focus();
        return;
      }

      chatStatus.textContent = "Preparing a bounded response…";
      const remoteReply = await requestRemoteAnswer(message, sessionId);
      const reply = remoteReply || answerLocally(message);
      createChatMessage("assistant", reply, messageLog);
      chatStatus.textContent = remoteReply
        ? "Automated ECS assistant • governed network response."
        : "Automated ECS assistant • bounded on-site response.";
      chatSendButton.disabled = false;
      chatComposer.focus();
    };

    chatSendButton.addEventListener("click", submitMessage);
    chatComposer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void submitMessage();
      }
    });
  } else {
    chatStatus.textContent = "Live chat is being prepared. Use the contact or client-intake channels for immediate assistance.";
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
