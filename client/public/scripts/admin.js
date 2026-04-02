const SYNC_EVENT_KEY = "chaudhri-clicks-sync";

const q = (id) => document.getElementById(id);

const state = {
  section: "dashboard",
  categories: [],
  portfolioItems: [],
  pricingPlans: [],
  testimonials: [],
  leads: [],
  content: null,
  settings: null
};

const ui = {
  notice: q("adminNotice"),
  categoryForm: q("categoryForm"),
  portfolioForm: q("portfolioForm"),
  pricingForm: q("pricingForm"),
  contentForm: q("contentForm"),
  settingsForm: q("settingsForm"),
  testimonialForm: q("testimonialForm"),
  categoryBody: q("categoryTableBody"),
  portfolioList: q("portfolioList"),
  pricingList: q("pricingList"),
  leadsBody: q("leadsTableBody"),
  testimonialList: q("testimonialList"),
  dashboardStats: q("dashboardStats"),
  recentLeads: q("dashboardRecentLeads"),
  portfolioPreview: q("portfolioPreview"),
  portfolioCategory: q("portfolioCategory")
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeJsonParse(text) {
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (_error) {
    return {};
  }
}

function setNotice(message, type = "") {
  ui.notice.textContent = message;
  ui.notice.className = `notice ${type}`.trim();
}

function clearNotice() {
  setNotice("");
}

function statusClass(value) {
  return String(value || "").toLowerCase();
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function triggerSiteRefresh() {
  try {
    localStorage.setItem(SYNC_EVENT_KEY, String(Date.now()));
  } catch (_error) {
    // Ignore storage write issues.
  }
}

function normalizePayload(data) {
  state.categories = data.categories || [];
  state.portfolioItems = data.portfolioItems || [];
  state.pricingPlans = data.pricingPlans || [];
  state.testimonials = data.testimonials || [];
  state.leads = data.leads || [];
  state.content = {
    hero: {
      eyebrow: data.content?.hero?.eyebrow || "",
      titleLineOne: data.content?.hero?.titleLineOne || "",
      titleAccent: data.content?.hero?.titleAccent || "",
      description: data.content?.hero?.description || "",
      primaryCta: data.content?.hero?.primaryCta || "View Portfolio",
      secondaryCta: data.content?.hero?.secondaryCta || "Let's Talk",
      backgroundImage: data.content?.hero?.backgroundImage || ""
    },
    about: {
      eyebrow: data.content?.about?.eyebrow || "",
      title: data.content?.about?.title || "",
      descriptionOne: data.content?.about?.descriptionOne || "",
      descriptionTwo: data.content?.about?.descriptionTwo || "",
      image: data.content?.about?.image || "",
      ctaLabel: data.content?.about?.ctaLabel || "Read Full Story",
      stats: Array.isArray(data.content?.about?.stats) && data.content.about.stats.length
        ? data.content.about.stats.slice(0, 2)
        : [{ value: "", label: "" }, { value: "", label: "" }]
    },
    pricing: {
      eyebrow: data.content?.pricing?.eyebrow || "Investment",
      title: data.content?.pricing?.title || "Photography Packages"
    },
    contact: {
      eyebrow: data.content?.contact?.eyebrow || "",
      title: data.content?.contact?.title || "",
      description: data.content?.contact?.description || ""
    }
  };
  state.settings = {
    contact: {
      phone: data.settings?.contact?.phone || "",
      email: data.settings?.contact?.email || "",
      location: data.settings?.contact?.location || "",
      whatsapp: data.settings?.contact?.whatsapp || ""
    },
    social: {
      instagram: data.settings?.social?.instagram || "",
      facebook: data.settings?.social?.facebook || ""
    },
    brand: {
      description: data.settings?.brand?.description || "",
      instagramHandle: data.settings?.brand?.instagramHandle || ""
    }
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  const data = safeJsonParse(text);

  if (response.status === 401) {
    window.location.replace("/admin");
    throw new Error("Your session has expired.");
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}.`);
  }

  return data;
}

function renderSection(name) {
  state.section = name;
  document.querySelectorAll(".sidebar-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.sectionTarget === name);
  });
  document.querySelectorAll(".admin-section").forEach((section) => {
    section.classList.toggle("visible", section.id === `${name}Section`);
  });
}

function renderDashboard() {
  const newLeads = state.leads.filter((lead) => lead.status === "New").length;
  ui.dashboardStats.innerHTML = `
    <article class="stat-card"><span>Categories</span><strong>${state.categories.length}</strong></article>
    <article class="stat-card"><span>Portfolio Items</span><strong>${state.portfolioItems.length}</strong></article>
    <article class="stat-card"><span>Pricing Plans</span><strong>${state.pricingPlans.length}</strong></article>
    <article class="stat-card"><span>New Leads</span><strong>${newLeads}</strong></article>
    <article class="stat-card"><span>Testimonials</span><strong>${state.testimonials.length}</strong></article>
  `;

  ui.recentLeads.innerHTML = state.leads.length
    ? state.leads.slice(0, 5).map((lead) => `
        <tr>
          <td>${escapeHtml(lead.name)}</td>
          <td>${escapeHtml(lead.phone)}</td>
          <td>${escapeHtml(lead.eventType)}</td>
          <td>${escapeHtml(formatDate(lead.eventDate))}</td>
          <td><span class="badge ${escapeHtml(statusClass(lead.status))}">${escapeHtml(lead.status)}</span></td>
        </tr>
      `).join("")
    : `<tr><td colspan="5">No leads yet.</td></tr>`;
}

function renderCategories() {
  ui.categoryBody.innerHTML = state.categories.length
    ? state.categories.map((category) => `
        <tr>
          <td>${escapeHtml(category.name)}</td>
          <td>${escapeHtml(category.slug)}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="mini-btn" data-action="edit-category" data-id="${escapeHtml(category._id)}">Edit</button>
              <button type="button" class="mini-btn danger" data-action="delete-category" data-id="${escapeHtml(category._id)}">Delete</button>
            </div>
          </td>
        </tr>
      `).join("")
    : `<tr><td colspan="3">No categories created yet.</td></tr>`;

  ui.portfolioCategory.innerHTML = state.categories
    .map((category) => `<option value="${escapeHtml(category._id)}">${escapeHtml(category.name)}</option>`)
    .join("");
}

function renderPortfolioPreview(url = "") {
  ui.portfolioPreview.innerHTML = url
    ? `<img src="${escapeHtml(url)}" alt="Portfolio preview">`
    : "<span>No image selected yet.</span>";
}

function renderPortfolio() {
  ui.portfolioList.innerHTML = state.portfolioItems.length
    ? state.portfolioItems.map((item) => `
        <article class="portfolio-admin-card">
          <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}">
          <div class="portfolio-admin-copy">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.category ? item.category.name : "Unassigned")}</p>
            <div class="table-actions">
              <button type="button" class="mini-btn" data-action="edit-portfolio" data-id="${escapeHtml(item.id)}">Edit</button>
              <button type="button" class="mini-btn danger" data-action="delete-portfolio" data-id="${escapeHtml(item.id)}">Delete</button>
            </div>
          </div>
        </article>
      `).join("")
    : "<p>No portfolio items uploaded yet.</p>";
}

function renderPricingPlans() {
  ui.pricingList.innerHTML = state.pricingPlans.length
    ? state.pricingPlans.map((plan) => `
        <article class="pricing-admin-card">
          <div class="pricing-admin-header">
            <div>
              <h4>${escapeHtml(plan.title)}</h4>
              <p>${escapeHtml(plan.price)}</p>
            </div>
            ${plan.featured ? '<span class="featured-chip">Most Popular</span>' : ""}
          </div>
          <ul class="feature-list">
            ${(Array.isArray(plan.features) ? plan.features : [])
              .map((feature) => `<li>${escapeHtml(feature)}</li>`)
              .join("")}
          </ul>
          <div class="table-actions">
            <button type="button" class="mini-btn" data-action="edit-pricing" data-id="${escapeHtml(plan._id)}">Edit</button>
            <button type="button" class="mini-btn danger" data-action="delete-pricing" data-id="${escapeHtml(plan._id)}">Delete</button>
          </div>
        </article>
      `).join("")
    : "<p>No pricing plans created yet.</p>";
}

function fillContentForm() {
  q("heroEyebrow").value = state.content.hero.eyebrow;
  q("heroTitleLineOne").value = state.content.hero.titleLineOne;
  q("heroTitleAccent").value = state.content.hero.titleAccent;
  q("heroDescription").value = state.content.hero.description;
  q("heroPrimaryCta").value = state.content.hero.primaryCta;
  q("heroSecondaryCta").value = state.content.hero.secondaryCta;
  q("heroBackgroundImage").value = state.content.hero.backgroundImage;
  q("aboutEyebrow").value = state.content.about.eyebrow;
  q("aboutTitle").value = state.content.about.title;
  q("aboutDescriptionOne").value = state.content.about.descriptionOne;
  q("aboutDescriptionTwo").value = state.content.about.descriptionTwo;
  q("aboutImage").value = state.content.about.image;
  q("aboutCtaLabel").value = state.content.about.ctaLabel;
  q("aboutStatOneValue").value = state.content.about.stats[0]?.value || "";
  q("aboutStatOneLabel").value = state.content.about.stats[0]?.label || "";
  q("aboutStatTwoValue").value = state.content.about.stats[1]?.value || "";
  q("aboutStatTwoLabel").value = state.content.about.stats[1]?.label || "";
  q("contactEyebrow").value = state.content.contact.eyebrow;
  q("contactTitle").value = state.content.contact.title;
  q("contactDescription").value = state.content.contact.description;
}

function renderLeads() {
  ui.leadsBody.innerHTML = state.leads.length
    ? state.leads.map((lead) => `
        <tr>
          <td>${escapeHtml(lead.name)}</td>
          <td>${escapeHtml(lead.phone)}</td>
          <td>${escapeHtml(lead.eventType)}</td>
          <td>${escapeHtml(formatDate(lead.eventDate))}</td>
          <td>${escapeHtml((lead.message || "-").slice(0, 72))}</td>
          <td><span class="badge ${escapeHtml(statusClass(lead.status))}">${escapeHtml(lead.status)}</span></td>
          <td>
            <div class="table-actions">
              <button type="button" class="mini-btn" data-action="toggle-lead" data-id="${escapeHtml(lead._id)}" data-status="${escapeHtml(lead.status)}">${lead.status === "Contacted" ? "Mark New" : "Mark Contacted"}</button>
              <button type="button" class="mini-btn danger" data-action="delete-lead" data-id="${escapeHtml(lead._id)}">Delete</button>
            </div>
          </td>
        </tr>
      `).join("")
    : `<tr><td colspan="7">No leads have been submitted yet.</td></tr>`;
}

function renderTestimonials() {
  ui.testimonialList.innerHTML = state.testimonials.length
    ? state.testimonials.map((item) => `
        <article class="testimonial-admin-card">
          <h4>${escapeHtml(item.author)}</h4>
          <p>${escapeHtml(item.role || "Client")}</p>
          <p>"${escapeHtml(item.quote)}"</p>
          <div class="table-actions">
            <button type="button" class="mini-btn" data-action="edit-testimonial" data-id="${escapeHtml(item._id)}">Edit</button>
            <button type="button" class="mini-btn danger" data-action="delete-testimonial" data-id="${escapeHtml(item._id)}">Delete</button>
          </div>
        </article>
      `).join("")
    : "<p>No testimonials published yet.</p>";
}

function fillSettingsForm() {
  q("settingsPhone").value = state.settings.contact.phone;
  q("settingsEmail").value = state.settings.contact.email;
  q("settingsLocation").value = state.settings.contact.location;
  q("settingsWhatsapp").value = state.settings.contact.whatsapp;
  q("settingsInstagramHandle").value = state.settings.brand.instagramHandle;
  q("settingsBrandDescription").value = state.settings.brand.description;
  q("settingsInstagram").value = state.settings.social.instagram;
  q("settingsFacebook").value = state.settings.social.facebook;
}

function renderAll() {
  renderDashboard();
  renderCategories();
  renderPortfolio();
  renderPricingPlans();
  fillContentForm();
  renderLeads();
  renderTestimonials();
  fillSettingsForm();
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function resetCategoryForm() {
  q("categoryId").value = "";
  q("categoryName").value = "";
}

function resetPortfolioForm() {
  q("portfolioId").value = "";
  q("portfolioTitle").value = "";
  q("portfolioImage").value = "";
  if (state.categories[0]) q("portfolioCategory").value = state.categories[0]._id;
  renderPortfolioPreview("");
}

function resetPricingForm() {
  q("pricingId").value = "";
  q("pricingPlanTitle").value = "";
  q("pricingPlanPrice").value = "";
  q("pricingPlanButton").value = "Choose Plan";
  q("pricingPlanOrder").value = "";
  q("pricingPlanFeatures").value = "";
  q("pricingPlanFeatured").checked = false;
}

function resetTestimonialForm() {
  q("testimonialId").value = "";
  q("testimonialQuote").value = "";
  q("testimonialAuthor").value = "";
  q("testimonialRole").value = "";
}

async function loadBootstrap() {
  normalizePayload(await request("/api/admin/bootstrap"));
  renderAll();
}

function buildContentPayload() {
  return {
    hero: {
      eyebrow: q("heroEyebrow").value.trim(),
      titleLineOne: q("heroTitleLineOne").value.trim(),
      titleAccent: q("heroTitleAccent").value.trim(),
      description: q("heroDescription").value.trim(),
      primaryCta: q("heroPrimaryCta").value.trim(),
      secondaryCta: q("heroSecondaryCta").value.trim(),
      backgroundImage: q("heroBackgroundImage").value.trim()
    },
    about: {
      eyebrow: q("aboutEyebrow").value.trim(),
      title: q("aboutTitle").value.trim(),
      descriptionOne: q("aboutDescriptionOne").value.trim(),
      descriptionTwo: q("aboutDescriptionTwo").value.trim(),
      image: q("aboutImage").value.trim(),
      ctaLabel: q("aboutCtaLabel").value.trim(),
      stats: [
        { value: q("aboutStatOneValue").value.trim(), label: q("aboutStatOneLabel").value.trim() },
        { value: q("aboutStatTwoValue").value.trim(), label: q("aboutStatTwoLabel").value.trim() }
      ]
    },
    pricing: {
      eyebrow: state.content.pricing.eyebrow,
      title: state.content.pricing.title
    },
    contact: {
      eyebrow: q("contactEyebrow").value.trim(),
      title: q("contactTitle").value.trim(),
      description: q("contactDescription").value.trim()
    }
  };
}

function buildSettingsPayload() {
  return {
    contact: {
      phone: q("settingsPhone").value.trim(),
      email: q("settingsEmail").value.trim(),
      location: q("settingsLocation").value.trim(),
      whatsapp: q("settingsWhatsapp").value.trim()
    },
    social: {
      instagram: q("settingsInstagram").value.trim(),
      facebook: q("settingsFacebook").value.trim()
    },
    brand: {
      description: q("settingsBrandDescription").value.trim(),
      instagramHandle: q("settingsInstagramHandle").value.trim()
    }
  };
}

function buildPricingPayload() {
  return {
    title: q("pricingPlanTitle").value.trim(),
    price: q("pricingPlanPrice").value.trim(),
    buttonLabel: q("pricingPlanButton").value.trim() || "Choose Plan",
    order: q("pricingPlanOrder").value ? Number(q("pricingPlanOrder").value) : undefined,
    featured: q("pricingPlanFeatured").checked,
    features: q("pricingPlanFeatures").value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  };
}

async function afterMutation(message, resetFn) {
  await loadBootstrap();
  if (typeof resetFn === "function") resetFn();
  setNotice(message, "success");
  triggerSiteRefresh();
}

async function deleteResource(url, message, resetFn) {
  await request(url, { method: "DELETE" });
  await afterMutation(message, resetFn);
}

function findPortfolio(id) {
  return state.portfolioItems.find((item) => item.id === id);
}

function findPricingPlan(id) {
  return state.pricingPlans.find((plan) => plan._id === id);
}

function bindForms() {
  ui.categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearNotice();

    try {
      const id = q("categoryId").value.trim();
      await request(id ? `/api/admin/categories/${id}` : "/api/admin/categories", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: q("categoryName").value.trim() })
      });
      await afterMutation("Category saved successfully.", resetCategoryForm);
    } catch (error) {
      setNotice(error.message, "error");
    }
  });

  q("categoryReset").addEventListener("click", resetCategoryForm);

  ui.portfolioForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearNotice();

    const id = q("portfolioId").value.trim();
    const file = q("portfolioImage").files[0];

    if (!id && !file) {
      setNotice("Please upload an image for the new portfolio item.", "error");
      return;
    }

    try {
      const body = new FormData();
      body.append("title", q("portfolioTitle").value.trim());
      body.append("categoryId", q("portfolioCategory").value);
      if (file) body.append("image", file);

      await request(id ? `/api/admin/portfolio/${id}` : "/api/admin/portfolio", {
        method: id ? "PUT" : "POST",
        body
      });

      await afterMutation("Portfolio item saved successfully.", resetPortfolioForm);
    } catch (error) {
      setNotice(error.message, "error");
    }
  });

  q("portfolioReset").addEventListener("click", resetPortfolioForm);
  q("portfolioImage").addEventListener("change", () => {
    const file = q("portfolioImage").files[0];
    if (!file) return renderPortfolioPreview("");

    const reader = new FileReader();
    reader.onload = () => renderPortfolioPreview(reader.result);
    reader.readAsDataURL(file);
  });

  ui.pricingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearNotice();

    try {
      const id = q("pricingId").value.trim();
      await request(id ? `/api/admin/pricing/${id}` : "/api/admin/pricing", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPricingPayload())
      });
      await afterMutation("Pricing plan saved successfully.", resetPricingForm);
    } catch (error) {
      setNotice(error.message, "error");
    }
  });

  q("pricingReset").addEventListener("click", resetPricingForm);

  ui.contentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearNotice();

    try {
      await request("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildContentPayload())
      });
      await afterMutation("Website content updated successfully.");
    } catch (error) {
      setNotice(error.message, "error");
    }
  });

  ui.settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearNotice();

    try {
      await request("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSettingsPayload())
      });
      await afterMutation("Settings saved successfully.");
    } catch (error) {
      setNotice(error.message, "error");
    }
  });

  ui.testimonialForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearNotice();

    try {
      const id = q("testimonialId").value.trim();
      await request(id ? `/api/admin/testimonials/${id}` : "/api/admin/testimonials", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: q("testimonialQuote").value.trim(),
          author: q("testimonialAuthor").value.trim(),
          role: q("testimonialRole").value.trim()
        })
      });
      await afterMutation("Testimonial saved successfully.", resetTestimonialForm);
    } catch (error) {
      setNotice(error.message, "error");
    }
  });

  q("testimonialReset").addEventListener("click", resetTestimonialForm);
  q("logoutButton").addEventListener("click", async () => {
    try {
      await request("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.replace("/admin");
    }
  });
}

function bindActions() {
  document.querySelectorAll(".sidebar-link").forEach((button) => {
    button.addEventListener("click", () => renderSection(button.dataset.sectionTarget));
  });

  ui.categoryBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const category = state.categories.find((item) => item._id === button.dataset.id);

    if (button.dataset.action === "edit-category" && category) {
      q("categoryId").value = category._id;
      q("categoryName").value = category.name;
      renderSection("categories");
    }

    if (button.dataset.action === "delete-category" && window.confirm("Delete this category?")) {
      try {
        await deleteResource(`/api/admin/categories/${button.dataset.id}`, "Category deleted successfully.", resetCategoryForm);
      } catch (error) {
        setNotice(error.message, "error");
      }
    }
  });

  ui.portfolioList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "edit-portfolio") {
      const item = findPortfolio(button.dataset.id);
      if (!item) return;

      q("portfolioId").value = item.id;
      q("portfolioTitle").value = item.title;
      q("portfolioCategory").value = item.category ? item.category.id : "";
      renderPortfolioPreview(item.imageUrl);
      renderSection("portfolio");
    }

    if (button.dataset.action === "delete-portfolio" && window.confirm("Delete this portfolio item?")) {
      try {
        await deleteResource(`/api/admin/portfolio/${button.dataset.id}`, "Portfolio item deleted successfully.", resetPortfolioForm);
      } catch (error) {
        setNotice(error.message, "error");
      }
    }
  });

  ui.pricingList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "edit-pricing") {
      const plan = findPricingPlan(button.dataset.id);
      if (!plan) return;

      q("pricingId").value = plan._id;
      q("pricingPlanTitle").value = plan.title;
      q("pricingPlanPrice").value = plan.price;
      q("pricingPlanButton").value = plan.buttonLabel || "Choose Plan";
      q("pricingPlanOrder").value = plan.order || "";
      q("pricingPlanFeatures").value = (plan.features || []).join("\n");
      q("pricingPlanFeatured").checked = Boolean(plan.featured);
      renderSection("pricing");
    }

    if (button.dataset.action === "delete-pricing" && window.confirm("Delete this pricing plan?")) {
      try {
        await deleteResource(`/api/admin/pricing/${button.dataset.id}`, "Pricing plan deleted successfully.", resetPricingForm);
      } catch (error) {
        setNotice(error.message, "error");
      }
    }
  });

  ui.leadsBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    try {
      if (button.dataset.action === "toggle-lead") {
        const nextStatus = button.dataset.status === "Contacted" ? "New" : "Contacted";
        await request(`/api/admin/leads/${button.dataset.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus })
        });
        await afterMutation("Lead status updated successfully.");
      }

      if (button.dataset.action === "delete-lead" && window.confirm("Delete this lead?")) {
        await deleteResource(`/api/admin/leads/${button.dataset.id}`, "Lead deleted successfully.");
      }
    } catch (error) {
      setNotice(error.message, "error");
    }
  });

  ui.testimonialList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const item = state.testimonials.find((entry) => entry._id === button.dataset.id);

    if (button.dataset.action === "edit-testimonial" && item) {
      q("testimonialId").value = item._id;
      q("testimonialQuote").value = item.quote;
      q("testimonialAuthor").value = item.author;
      q("testimonialRole").value = item.role || "";
      renderSection("testimonials");
    }

    if (button.dataset.action === "delete-testimonial" && window.confirm("Delete this testimonial?")) {
      try {
        await deleteResource(`/api/admin/testimonials/${button.dataset.id}`, "Testimonial deleted successfully.", resetTestimonialForm);
      } catch (error) {
        setNotice(error.message, "error");
      }
    }
  });
}

async function init() {
  bindForms();
  bindActions();
  renderSection(state.section);

  try {
    await loadBootstrap();
    resetPortfolioForm();
    resetCategoryForm();
    resetPricingForm();
    resetTestimonialForm();
  } catch (error) {
    setNotice(error.message, "error");
  }

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

init();
