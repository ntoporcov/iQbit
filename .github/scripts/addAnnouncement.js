// .github/scripts/addAnnouncement.js

const fs = require("fs");
const path = require("path");

const [
  title = "New Update",
  body = "Updates were pushed to the app",
  type = "info",
  newUser,
] = process.argv.slice(2);

// format Sep082025
let id = "";
const date = new Date();
const month = date.toLocaleString("default", { month: "short" });
const day = String(date.getDate()).padStart(2, "0");
const year = date.getFullYear();
id = `${month}${day}${year}`;

const filePath = path.resolve(process.cwd(), "announcements.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const announcement = { id, title, body, type };
if (newUser === "true") {
  announcement.newUser = true;
}

data.announcements.unshift(announcement);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Announcement added.");
