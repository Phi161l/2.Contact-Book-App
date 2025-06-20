const { json } = require("body-parser");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "../data/contacts.json");

app.use(express.json()); // To parse JSON requests
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve frontend


// Contact Add Api
app.post("/api/contacts", (req, res) => {
  const { name, email, phone}  = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newContact = { id: uuid(), name, email, phone };

  let contacts = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    contacts = JSON.parse(data);
  }

  contacts.push(newContact);
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));

  res.status(201).json({ message: "Contact added." });
});



// Contact Fetch endpoint
app.get("/api/contacts", (req, res) => {
  let contacts = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    contacts = JSON.parse(data);
  }
  res.json(contacts);
});


// contact delete endpoint
app.delete("/api/contacts/:id", (req, res) => {
  const contactId = req.params.id;

  let contacts = [];
  if(fs.existsSync(DATA_FILE)){
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      contacts = JSON.parse(data);
  }

  const updatedContacts = contacts.filter(contact => contact.id !== contactId);
  fs.writeFileSync(DATA_FILE, JSON.stringify(updatedContacts, null, 2));

  res.json({message: "contact deleted."})


});


// Contact Edit (Update) endpoint
app.put("/api/contacts/:id", (req, res) => {
    const contactId = req.params.id;
    const { name, email, phone } = req.body;
  
    let contacts = [];
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      contacts = JSON.parse(data);
    }
  
    const updatedContacts = contacts.map(contact =>
      contact.id === contactId
        ? { ...contact, name, email, phone }
        : contact
    );
  
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedContacts, null, 2));
  
    res.json({ message: "Contact updated" });
  });



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

