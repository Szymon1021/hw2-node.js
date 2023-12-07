
const argv = require("yargs").argv;
const contacts = require("./models/contacts");

const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
function invokeAction({ action, id, name, email, phone }) {
    if (!action) {
      console.warn("\x1B[31m No action provided!");
      return;
    }
  
    switch (action) {
      case "list":
        contacts.listContacts();
        break;
  
      case "get":
        contacts.getContactById(id);
        break;
  
      case "add":
        contacts.addContact(name, email, phone);
        break;
  
      case "remove":
        contacts.removeContact(id);
        break;
  
      default:
        console.warn(`\x1B[31m Unknown action type: ${action}`);
    }
  }
invokeAction(argv);