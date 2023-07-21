const sqlite3 = require("sqlite3").verbose();

const create_table = `
CREATE TABLE IF NOT EXISTS PAGES (
  id	INTEGER NOT NULL,
  title	TEXT NOT NULL UNIQUE,
  author	INTEGER NOT NULL,
  creation_date	TEXT NOT NULL,
  publication_date	TEXT,
  slug	TEXT NOT NULL UNIQUE,
  PRIMARY KEY(id AUTOINCREMENT),
FOREIGN KEY(author) REFERENCES USERS(id)
)`;
const pages = [];
const db = new sqlite3.Database("../db/db.sqlite", err => {
	if (err) throw err;

	// Create the users table if it doesn't exist
	db.serialize(() => {
		db.run(create_table, function (err) {
			if (err) {
				console.error(err.message);
				return;
			}

			// Iterate over the users array
			pages.forEach(page => {
				// Insert the details into the database
				const query =
					"INSERT INTO PAGES (title,author,creation_date,publication_date,slug) VALUES (?,?,?,?,?)";
				db.run(
					query,
					[
						page.title,
						page.author,
						page.creation_date,
						page.publication_date,
						page.slug,
					],
					function (err) {
						if (err) {
							console.error(err.message);
						} else {
							console.log(`Page ${page.title} inserted successfully`);
						}
					},
				);
			});
		});
		db.close();
	});

	// Close the database connection after all users are inserted
});
