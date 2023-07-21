const sqlite3 = require("sqlite3").verbose();

// Array of users
const details = [
	{ name: "siteName", val: "CMSmall" },
	{ name: "author", val: "Andrea Bonvissuto" },
	{ name: "authorID", val: "s308763" },
];

// Create a new SQLite database connection

const db = new sqlite3.Database("../db/db.sqlite", err => {
	if (err) throw err;

	// Create the users table if it doesn't exist
	db.serialize(() => {
		db.run(
			`
    CREATE TABLE IF NOT EXISTS SITE_VALUES (
      name TEXT NOT NULL UNIQUE PRIMARY KEY,
      val TEXT NOT NULL
    )
  `,
			function (err) {
				if (err) {
					console.error(err.message);
					return;
				}

				// Iterate over the users array
				details.forEach(entry => {
					// Insert the details into the database
					const query = "INSERT INTO SITE_DETAILS (name, val) VALUES (?, ?)";
					db.run(query, [entry.name, entry.val], function (err) {
						if (err) {
							console.error(err.message);
						} else {
							console.log(`User ${entry.name} inserted successfully`);
						}
					});
				});
			},
		);
		db.close();
	});

	// Close the database connection after all users are inserted
});
