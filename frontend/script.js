const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("searchInput");

// Fetch and display all contacts
async function loadContacts() {
  const res = await fetch("/api/contacts");
  const contacts = await res.json();

  contactList.innerHTML = ""; // Clear list

  contacts.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";

    card.innerHTML = `
      <span><strong>Name:</strong> ${contact.name}</span>
      <span><strong>Email:</strong> ${contact.email}</span>
      <span><strong>Phone:</strong> ${contact.phone}</span>
      <button onclick="editContact('${contact.id}')">Edit</button>
      <button class="delete-btn" onclick="deleteContact('${contact.id}')">Delete</button>
    `;

    contactList.appendChild(card);
  });
}

// Handle form submit (Add contact)
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !phone) {
    alert("Please fill all fields.");
    return;
  }

  await fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  });

  contactForm.reset();
  loadContacts(); // Refresh list
});



// Delete a contact
async function deleteContact(id) {
  const confirmed = confirm("Are you sure you want to delete this contact?");
  if (!confirmed) return;

  await fetch(`/api/contacts/${id}`, {         // api calling
    method: "DELETE",
  });

  loadContacts(); // Refresh list
}



// Edit a contact
async function editContact(id) {
  const res = await fetch(`/api/contacts`);
  const contacts = await res.json();
  const contact = contacts.find((c) => c.id === id);

  if (!contact) {
    alert("Contact not found.");
    return;
  }

  const name = prompt("Edit Name:", contact.name);
  const email = prompt("Edit Email:", contact.email);
  const phone = prompt("Edit Phone:", contact.phone);

  if (!name || !email || !phone) {
    alert("All fields are required.");
    return;
  }

  await fetch(`/api/contacts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  });

  loadContacts(); // Refresh list
}


// Filter contacts while typing
searchInput.addEventListener("input", async () => {
  const search = searchInput.value.toLowerCase().trim();
  const res = await fetch("/api/contacts");
  const contacts = await res.json();

  const filtered = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.includes(search)
  );

  contactList.innerHTML = "";

  filtered.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";

    card.innerHTML = `
      <span><strong>Name:</strong> ${contact.name}</span>
      <span><strong>Email:</strong> ${contact.email}</span>
      <span><strong>Phone:</strong> ${contact.phone}</span>
      <button onclick="editContact('${contact.id}')">Edit</button>
      <button class="delete-btn" onclick="deleteContact('${contact.id}')">Delete</button>
    `;

    contactList.appendChild(card);
  });
});

// Load contacts on page load
loadContacts();
