const express = require("express");
const router = express.Router();
const contactsTasks = require("../controller/contacts");


const userRoutes = require("../routes/userRoutes"); // Import the user routes




router.get("/", contactsTasks.listContacts);
router.get('/contacts', contactsTasks.listContacts);

router.get("/:contactId", contactsTasks.getContactById);

router.post("/", contactsTasks.createContact);

router.put("/:contactId", contactsTasks.updateContact);

router.delete("/:contactId", contactsTasks.removeContact);

router.patch("/:contactId/favorite", contactsTasks.updateStatusContact);

// Use the user routes
router.use("/users", userRoutes);


module.exports = router;