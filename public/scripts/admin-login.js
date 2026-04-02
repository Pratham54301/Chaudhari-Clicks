const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function setMessage(message, type = "") {
  loginMessage.textContent = message;
  loginMessage.className = `status-text ${type}`.trim();
}

async function checkSession() {
  try {
    const session = await fetchJson("/api/auth/session");

    if (session.authenticated) {
      window.location.replace("/admin/dashboard");
    }
  } catch (error) {
    console.error(error);
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("Checking credentials...");

  const payload = {
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value.trim()
  };

  try {
    await fetchJson("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setMessage("Login successful. Redirecting...", "success");
    window.setTimeout(() => {
      window.location.replace("/admin/dashboard");
    }, 400);
  } catch (error) {
    setMessage(error.message, "error");
  }
});

lucide.createIcons();
checkSession();
