var nodeq = require("../index.js"),
	assert = require("assert-plus"),
	async = require("async");

describe("syncreqres", function() {
	"use strict";
	var con;
	before(function(done) {
		nodeq.connect("localhost", 5000, function(err, c) {
			if (err) { throw err; }
			con = c;
			done();
		});
	});
	after(function(done) {
		con.close(function() {
			con = undefined;
			done();
		});
	});
	it("evaluate q", function(done) {
		con.k("sum 1 2 3", function(err, res) {
			if (err) { throw err; }
			assert.equal(res, 6, "res");
			done();
		});
	});
	it("evaluate function with one parameter", function(done) {
		con.k("sum", [1, 2, 3], function(err, res) {
			if (err) { throw err; }
			assert.equal(res, 6, "res");
			done();
		});
	});
	it("mass requests", function(done) {
		async.map([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], function(i, cb) {
			con.k("sum", [i, i], cb);
		}, function(err, res) {
			if (err) { throw err; }
			assert.deepEqual(res, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18], "res");
			done();
		});
	});
});
