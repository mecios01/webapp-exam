const db = require("../db/connection.js");
const rollbackTransaction = () => {
	db.run("ROLLBACK", function (err) {
		if (err) {
			console.error(err);
		}
	});
};
const insert = page => {
	db.all(
		"INSERT INTO PAGES (title,author,creation_date,publication_date) VALUES (?,?,?,?)",
		[page.title, page.author, page.creation_date, page.publication_date],
	);
};
const getBySlug = (role, pageSlug) => {
	const currentDate = new Date().toISOString().split("T")[0];

	const sql = !role
		? `
      SELECT 
      P.id as id,
      P.title as title,
      P.author as author,
      P.creation_date as creation_date,
      P.publication_date as publication_date, 
      P.slug as slug,
      U.name as author_name,
      U.email as author_email
      FROM PAGES P,USERS U
      WHERE datetime('now','utc') >= datetime(P.publication_date,'utc')  AND
        P.slug = ? AND
        P.author = U.id
      `
		: `
     SELECT 
      P.id as id,
      P.title as title,
      P.author as author,
      P.creation_date as creation_date,
      P.publication_date as publication_date, 
      P.slug as slug,
      U.name as author_name,
      U.email as author_email
      FROM PAGES P,USERS U
      WHERE slug = ? AND
      P.author = U.id
      `;

	const sql_contents = `
    SELECT type,data FROM CONTENTS WHERE page=? ORDER BY sequence`;
	return new Promise((resolve, reject) => {
		db.get(sql, [pageSlug], function (err, row) {
			if (err || !row?.id) {
				reject(err ?? "Not found");
			}
			db.all(sql_contents, [row?.id], function (err, rows) {
				if (err || rows?.length === 0) {
					return reject(err ?? "Not found");
				}
				const obj = {
					...row,
					author_name: undefined,
					author_email: undefined,
					author: { name: row.author_name, email: row.author_email },
					contents: [...rows],
				};
				resolve(obj);
			});
		});
	});
};

const getByTitle = title => {
	return new Promise((resolve, reject) => {
		db.get(`SELECT * FROM PAGES WHERE title=?`, [title], function (err, row) {
			if (err || !row) {
				reject(err ?? "No page found");
			}
			resolve(row);
		});
	});
};
const update = ({ id, title, publicationDate, author, newSlug, contents }) => {
	return new Promise((resolve, reject) => {
		const upd = `
    UPDATE PAGES
    SET title=?, publication_date=?, author=?, slug=?
    WHERE id=?
    `;
		const dlt = `
    DELETE FROM CONTENTS WHERE page=?
    `;
		const ins = `
    INSERT INTO CONTENTS (type,data,sequence,)
    `;
		try {
			db.serialize(() => {
				db.run("BEGIN TRANSACTION");
				//update page
				console.log("updating the page");

				db.run(upd, [title, publicationDate, author, newSlug, id]);
				console.log("deleting contents");

				//delete all contents
				db.run(dlt, [id]);

				console.log("inserting new contents");

				//insert new ones
				contents.forEach((content, index) => {
					db.run(
						"INSERT INTO CONTENTS (type, data, sequence, page) VALUES (?,?,?,?)",
						[content.type, content.content, index, id],
					);
				});

				console.log("all done go home");

				db.run("COMMIT", function (err) {
					if (err) {
						console.error(err);
						rollbackTransaction();
						reject(err);
					}
					resolve({ data: "OK" });
				});

				console.log("committed");
			});
		} catch (e) {
			console.error(e);
		}
	});
};
const getAll = role => {
	return new Promise((resolve, reject) => {
		if (!role) {
			const sql = `
        SELECT 
        P.id as id,
        P.title as title,
        U.email as author_email,
        U.name as author_name,
        creation_date as creationDate,
        publication_date as publicationDate,
        slug FROM PAGES P, USERS U
        WHERE
        publication_date IS NOT NULL 
        AND datetime('now','utc') >= datetime(publication_date,'utc') 
        AND P.author = U.id
        ORDER BY datetime(publication_date,'utc') DESC`;
			db.all(sql, (err, rows) => {
				if (err) {
					reject(err);
				}
				resolve(rows);
			});
		} else {
			const sql = `
        SELECT 
        P.id as id,
        P.title as title,
        U.email as author_email,
        U.name as author_name,
        creation_date as creationDate,
        publication_date as publicationDate,
        slug FROM PAGES P, USERS U
        WHERE P.author = U.id
        ORDER BY publication_date DESC
        `;
			db.all(sql, (err, rows) => {
				if (err) {
					reject(err);
				}
				resolve(rows);
			});
		}
	});
};

const getById = id => {
	return new Promise((resolve, reject) => {
		db.get(`SELECT * FROM PAGES WHERE id=?`, [id], function (err, row) {
			if (err) {
				reject(err);
			}
			resolve(row);
		});
	});
};
const getIdBySlug = slug => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT id FROM PAGES WHERE slug=?`;
		db.get(sql, [slug], function (err, row) {
			if (err) {
				console.error(err);
				reject(err);
			}
			resolve(row);
		});
	});
};

const deleteById = id => {
	return new Promise((resolve, reject) => {
		const sql = `DELETE FROM PAGES WHERE id=?`;
		db.run(sql, [id], function (err) {
			if (err) {
				console.error(err);
				reject(false);
			}
			db.run("DELETE FROM CONTENTS WHERE page=?", [id], function (err) {
				if (err) {
					console.error(err);
					reject(false);
				}
				resolve(true);
			});
		});
	});
};
exports.insert = insert;
exports.getBySlug = getBySlug;
exports.update = update;
exports.getAll = getAll;
exports.update = update;
exports.getByTitle = getByTitle;
exports.getById = getById;
exports.deleteById = deleteById;
