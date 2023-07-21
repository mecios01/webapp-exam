"use strict";
const db = require("../db/connection.js");
const crypto = require("crypto");
function find(username, password) {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM USERS WHERE email=?";
		db.get(sql, [username], (err, row) => {
			if (err) {
				// database error
				reject(err);
			} else {
				if (!row) {
					// non-existent user
					reject("Invalid username or password");
				} else {
					const providedSalted = crypto.scryptSync(password, row.salt, 32);
					if (!providedSalted) {
						reject("Invalid username or password");
					}
					const equal = crypto.timingSafeEqual(
						providedSalted,
						Buffer.from(row.password, "hex"),
					);
					if (equal) {
						resolve({ ...row, password: undefined, salt: undefined });
					} else {
						reject("Invalid username or password");
					}
				}
			}
		});
	});
}

function findAll() {
	return new Promise((resolve, reject) => {
		const sql = "SELECT name, email FROM USERS";
		db.all(sql, (err, rows) => {
			if (err) {
				reject(err);
			}
			resolve(rows);
		});
	});
}

function findByEmail(email) {
	return new Promise((resolve, reject) => {
		const sql = "SELECT id, email FROM USERS WHERE email=?";
		db.get(sql, [email], (err, rows) => {
			if (err) {
				reject(err);
			}
			resolve(rows);
		});
	});
}
exports.find = find;
exports.findAll = findAll;
exports.findByEmail = findByEmail;
