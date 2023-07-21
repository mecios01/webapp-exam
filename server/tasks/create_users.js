const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();

// Function to generate a random salt
function generateSalt() {
	return crypto.randomBytes(16).toString("hex");
}

// Function to hash the password using scrypt
function hashPassword(password, salt) {
	const key = crypto.scryptSync(password, salt, 32);
	return key.toString("hex");
}

// Array of users
const users = [
	{
		email: "a1@e.com",
		name: "Admin1",
		password: "psw",
		role: "admin",
	},
	{
		email: "a2@e.com",
		name: "Admin2",
		password: "psw",
		role: "admin",
	},
	{
		email: "u1@e.com",
		name: "User1",
		password: "psw",
		role: "user",
	},
	{
		email: "u2@e.com",
		name: "User2",
		password: "psw",
		role: "user",
	},
	{
		email: "u3@e.com",
		name: "User3",
		password: "psw",
		role: "user",
	},
	// Add more users as needed
];

// Create a new SQLite database connection

const db = new sqlite3.Database("../db/db.sqlite", err => {
	if (err) throw err;

	// Create the users table if it doesn't exist
	db.serialize(() => {
		db.run(
			`
    CREATE TABLE IF NOT EXISTS USERS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `,
			function (err) {
				if (err) {
					console.error(err.message);
					return;
				}

				// Iterate over the users array
				users.forEach(user => {
					// Generate the salt
					const salt = generateSalt();

					// Hash the password
					const hashedPassword = hashPassword(user.password, salt);

					// Insert the user into the database
					const query =
						"INSERT INTO USERS (name,email, password, salt, role) VALUES (?,?, ?, ?, ?)";
					db.run(
						query,
						[user.name, user.email, hashedPassword, salt, user.role],
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log(`User ${user.email} inserted successfully`);
							}
						},
					);
				});
			},
		);
		db.close();
	});

	// Close the database connection after all users are inserted
});
