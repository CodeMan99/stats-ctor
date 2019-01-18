'use strict';

const test = require('tape');
const fs = require('fs');
const Stats = require('.');
const HAS_MS = (() => {
	const stat = new fs.Stats();

	return ['atimeMs', 'mtimeMs', 'ctimeMs', 'birthtimeMs'].every(key => stat.hasOwnProperty(key));
})();

test('default values', t => {
	const restore = mockDateNow(Date.now());
	const uid = process.getuid();
	const gid = process.getgid();
	const now = Date.now();
	const stat = new Stats();

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

	if (HAS_MS) {
		t.equal(stat.atimeMs, now, 'atimeMs ok');
		t.equal(stat.mtimeMs, now, 'mtimeMs ok');
		t.equal(stat.ctimeMs, now, 'ctimeMs ok');
		t.equal(stat.birthtimeMs, now, 'birthtimeMs ok');
		t.equal(stat.propertyIsEnumerable('atimeMs'), false, 'atimeMs non-enumerable');
		t.equal(stat.propertyIsEnumerable('mtimeMs'), false, 'mtimeMs non-enumerable');
		t.equal(stat.propertyIsEnumerable('ctimeMs'), false, 'ctimeMs non-enumerable');
		t.equal(stat.propertyIsEnumerable('birthtimeMs'), false, 'birthtimeMs non-enumerable');
	}

	t.end();

	restore();
});

test('provide mode', t => {
	const stat = new Stats({
		mode: 0o666
	});

	t.equal(stat.mode, 0o666, 'ok');
	t.end();
});

test('provide mtime milliseconds', t => {
	const stat = new Stats({
		mtim_msec: 31536000000
	});

	t.equal(stat.mtime.getTime(), 31536000000, 'ok');

	if (HAS_MS) {
		t.equal(stat.mtimeMs, 31536000000, 'ok');
	}

	t.end();
});

test('get/set atime milliseconds after creation', t => {
	const restore = mockDateNow(Date.now());
	const now = Date.now();
	const stat = new Stats();

	t.equal(stat.atim_msec, now, 'getter ok');

	stat.atim_msec = now + 1000;

	t.equal(stat.atime.getTime(), now + 1000, 'setter ok');

	if (HAS_MS) {
		t.equal(stat.atimeMs, now + 1000, 'setter updated atimeMs ok');
	}

	t.end();

	restore();
});

test('get/set mtime milliseconds after creation', t => {
	const restore = mockDateNow(Date.now());
	const now = Date.now();
	const stat = new Stats();

	t.equal(stat.mtim_msec, now, 'getter ok');

	stat.mtim_msec = now + 1000;

	t.equal(stat.mtime.getTime(), now + 1000, 'setter ok');

	if (HAS_MS) {
		t.equal(stat.mtimeMs, now + 1000, 'setter updated mtimeMs ok');
	}

	t.end();

	restore();
});

test('get/set ctime milliseconds after creation', t => {
	const restore = mockDateNow(Date.now());
	const now = Date.now();
	const stat = new Stats();

	t.equal(stat.ctim_msec, now, 'getter ok');

	stat.ctim_msec = now + 1000;

	t.equal(stat.ctime.getTime(), now + 1000, 'setter ok');

	if (HAS_MS) {
		t.equal(stat.ctimeMs, now + 1000, 'setter updated ctimeMs ok');
	}

	t.end();

	restore();
});

test('get/set birthtime milliseconds after creation', t => {
	const restore = mockDateNow(Date.now());
	const now = Date.now();
	const stat = new Stats();

	t.equal(stat.birthtim_msec, now, 'getter ok');

	stat.birthtim_msec = now + 1000;

	t.equal(stat.birthtime.getTime(), now + 1000, 'setter ok');

	if (HAS_MS) {
		t.equal(stat.birthtimeMs, now + 1000, 'setter updated birthtimeMs ok');
	}

	t.end();

	restore();
});

test('copy file stats', t => {
	fs.stat(__filename, (err, stat) => {
		if (err) return t.end(err);

		compare(t, stat);
		t.end();
	});
});

test('copy directory stats', t => {
	fs.stat(__dirname, (err, stat) => {
		if (err) return t.end(err);

		compare(t, stat);
		t.end();
	});
});

function compare(t, stat) {
	const copy = new Stats(stat);

	t.ok(stat instanceof fs.Stats, 'original is an fs.Stat');
	t.ok(copy instanceof fs.Stats, 'copy is an fs.Stat');
	t.notEqual(stat, copy, 'not a shallow copy');

	for (const prop in stat) {
		if (stat.hasOwnProperty(prop)) {
			t.equal(stat[prop].valueOf(), copy[prop].valueOf(), 'equal value for stat.' + prop);
		}
	}

	for (const method in Object.getPrototypeOf(stat)) {
		if (method.startsWith('_')) continue;

		if (typeof stat[method] === 'function') {
			t.equal(stat[method](), copy[method](), 'equal value for stat.' + method + '()');
		} else {
			t.equal(stat[method].valueOf(), copy[method].valueOf(), 'equal value for stat.' + method);
		}
	}
}

function mockDateNow(value) {
	const original = Date.now;

	Date.now = () => value;

	// restore original
	return () => {
		Date.now = original;
	};
}
