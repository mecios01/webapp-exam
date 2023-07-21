const sqlite3 = require("sqlite3").verbose();

const create_table = `
CREATE TABLE IF NOT EXISTS CONTENTS (
type TEXT NOT NULL,
data TEXT NOT NULL,
sequence INTEGER NOT NULL,
page INTEGER NOT NULL,
PRIMARY KEY(page, sequence),
FOREIGN KEY(page) REFERENCES PAGES(id)
)`;

const contents = [];

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
			contents.forEach(content => {
				const query = "INSERT INTO CONTENTS (type,data,page) VALUES (?, ?, ?)";
				db.run(
					query,
					[content.type, content.data, content.page],
					function (err) {
						if (err) {
							console.error(err.message);
						} else {
							console.log(`Content ${content} inserted successfully`);
						}
					},
				);
			});
		});
		db.close();
	});

	// Close the database connection after all users are inserted
});
