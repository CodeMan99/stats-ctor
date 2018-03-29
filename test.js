var test = require('tape');
var fs = require('fs');
var Stats = require('.');

test('default values', function(t) {
	var restore = mockDateNow(Date.now());

	var uid = process.getuid();
	var gid = process.getgid();
	var now = Date.now();
	var stat = new Stats();

	t.equal(stat.dev, 0, 'dev ok');
	t.equal(stat.mode, 0, 'mode ok');
	t.equal(stat.nlink, 0, 'nlink ok');
	t.equal(stat.uid, uid, 'uid ok');
	t.equal(stat.gid, gid, 'gid ok');
	t.equal(stat.rdev, 0, 'rdev ok');
	t.equal(stat.blksize, 0, 'blksize ok');
	t.equal(stat.ino, 0, 'ino ok');
	t.equal(stat.size, 0, 'size ok');
	t.equal(stat.blocks, 0, 'blocks ok');
	t.equal(stat.atime.getTime(), now, 'atime ok');
	t.equal(stat.mtime.getTime(), now, 'mtime ok');
	t.equal(stat.ctime.getTime(), now, 'ctime ok');
	t.equal(stat.birthtime.getTime(), now, 'birthtime ok');
	t.end();

	restore();
});

test('provide mode', function(t) {
	var stat = new Stats({
		mode: 0o666
	});

	t.equal(stat.mode, 0o666, 'ok');
	t.end();
});

test('provide mtime milliseconds', function(t) {
	var stat = new Stats({
		mtim_msec: 31536000000
	});

	t.equal(stat.mtime.getTime(), 31536000000, 'ok');
	t.end();
});

test('get/set atime milliseconds after creation', function(t) {
	var restore = mockDateNow(Date.now());

	var now = Date.now();
	var stat = new Stats();

	t.equal(stat.atim_msec, now, 'getter ok');

	stat.atim_msec = now + 1000;

	t.equal(stat.atime.getTime(), now + 1000, 'setter ok');
	t.end();

	restore();
});

test('get/set mtime milliseconds after creation', function(t) {
	var restore = mockDateNow(Date.now());

	var now = Date.now();
	var stat = new Stats();

	t.equal(stat.mtim_msec, now, 'getter ok');

	stat.mtim_msec = now + 1000;

	t.equal(stat.mtime.getTime(), now + 1000, 'setter ok');
	t.end();

	restore();
});

test('get/set ctime milliseconds after creation', function(t) {
	var restore = mockDateNow(Date.now());

	var now = Date.now();
	var stat = new Stats();

	t.equal(stat.ctim_msec, now, 'getter ok');

	stat.ctim_msec = now + 1000;

	t.equal(stat.ctime.getTime(), now + 1000, 'setter ok');
	t.end();

	restore();
});

test('get/set birthtime milliseconds after creation', function(t) {
	var restore = mockDateNow(Date.now());

	var now = Date.now();
	var stat = new Stats();

	t.equal(stat.birthtim_msec, now, 'getter ok');

	stat.birthtim_msec = now + 1000;

	t.equal(stat.birthtime.getTime(), now + 1000, 'setter ok');
	t.end();

	restore();
});

test('copy file stats', function(t) {
	compare(t, fs.statSync(__filename));
	t.end();
});

test('copy directory stats', function(t) {
	compare(t, fs.statSync(__dirname));
	t.end();
});

function compare(t, stat) {
	var copy = new Stats(stat);

	t.ok(stat instanceof fs.Stats, 'original is an fs.Stat');
	t.ok(copy instanceof fs.Stats, 'copy is an fs.Stat');
	t.notEqual(stat, copy, 'not a shallow copy');

	for (var prop in stat) {
		if (stat.hasOwnProperty(prop)) {
			t.equal(stat[prop].valueOf(), copy[prop].valueOf(), 'equal value for stat.' + prop);
		}
	}

	for (var method in Object.getPrototypeOf(stat)) {
		if (method.startsWith('_')) continue;

		if (typeof stat[method] === 'function') {
			t.equal(stat[method](), copy[method](), 'equal value for stat.' + method + '()');
		} else {
			t.equal(stat[method].valueOf(), copy[method].valueOf(), 'equal value for stat.' + method);
		}
	}
}

function mockDateNow(value) {
	var original = Date.now;

	Date.now = function() {
		return value;
	};

	// restore original
	return function() {
		Date.now = original;
	};
}
