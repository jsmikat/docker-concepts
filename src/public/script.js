const API_BASE = "/api";
let visitors = [];

// DOM elements
const form = document.getElementById("visitorForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submitBtn");
const messageDiv = document.getElementById("message");
const visitorsListDiv = document.getElementById("visitorsList");

// Show message
function showMessage(text, type = "error") {
  messageDiv.innerHTML = `<div class="${type}">${text}</div>`;
  setTimeout(() => {
    messageDiv.innerHTML = "";
  }, 5000);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

// Render visitors list
function renderVisitors() {
  if (visitors.length === 0) {
    visitorsListDiv.innerHTML =
      '<div class="empty-state">No visitors yet</div>';
    return;
  }

  const html = visitors
    .map(
      (visitor) => `
                <div class="visitor-item">
                    <div class="visitor-name">${visitor.name}</div>
                    <div class="visitor-email">${visitor.email}</div>
                    <div class="visitor-date">${formatDate(
                      visitor.createdAt
                    )}</div>
                </div>
            `
    )
    .join("");

  visitorsListDiv.innerHTML = html;
}

// Fetch visitors
async function fetchVisitors() {
  try {
    const response = await fetch(`${API_BASE}/visitors`);
    if (!response.ok) throw new Error("Failed to fetch visitors");

    visitors = await response.json();
    renderVisitors();
  } catch (error) {
    console.error("Error fetching visitors:", error);
    visitorsListDiv.innerHTML =
      '<div class="error">Failed to load visitors</div>';
  }
}

// Add visitor
async function addVisitor(name, email) {
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding...";

    const response = await fetch(`${API_BASE}/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add visitor");
    }

    const newVisitor = await response.json();
    visitors.unshift(newVisitor);
    renderVisitors();

    form.reset();
    showMessage("Visitor added successfully!", "success");
  } catch (error) {
    console.error("Error adding visitor:", error);
    showMessage(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Add Visitor";
  }
}

// Form submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    showMessage("Please fill in all fields");
    return;
  }

  await addVisitor(name, email);
});

// Initialize
fetchVisitors();
