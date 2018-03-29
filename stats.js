var fs = require('fs');

module.exports = Stats;

/**
 * fs.Stats constructor with improved signature and defaults.
 * Also works as a copy constructor.
 *
 * @param {Object} [init] provide initial state
 * @param {Number} [init.dev=0]
 * @param {Number} [init.mode=0]
 * @param {Number} [init.nlink=0]
 * @param {Number} [init.uid] (Default: `process.getuid()`)
 * @param {Number} [init.gid] (Default: `process.getgid()`)
 * @param {Number} [init.rdev=0]
 * @param {Number} [init.blksize=0]
 * @param {Number} [init.ino=0]
 * @param {Number} [init.size=0]
 * @param {Number} [init.blocks=0]
 * @param {Number} [init.atim_msec] (Default: `Date.now()`)
 * @param {Number} [init.mtim_msec] (Default: `Date.now()`)
 * @param {Number} [init.ctim_msec] (Default: `Date.now()`)
 * @param {Number} [init.birthtim_msec] (Default: `Date.now()`)
 */
function Stats(init) {
	var _now = Date.now();

	fs.Stats.call(this,
		0,    // dev
		0,    // mode
		0,    // nlink
		null, // uid
		null, // gid
		0,    // rdev
		0,    // blksize
		0,    // ino
		0,    // size
		0,    // blocks
		_now, // atim_msec
		_now, // mtim_msec
		_now, // ctim_msec
		_now  // birthtim_msec
	);

	if (typeof init === 'object' && init !== null) {
		for (var key in init) {
			if (Object.prototype.hasOwnProperty.call(init, key)) {
				this[key] = init[key];
			}
		}
	}

	// setting uid last to minimize getuid() calls
	if (this.uid === null) {
		this.uid = process.getuid();
	}

	// setting uid last to minimize getgid() calls
	if (this.gid === null) {
		this.gid = process.getgid();
	}
}

Stats.prototype = Object.create(fs.Stats.prototype, {
	constructor: {
		configurable: true,
		enumerable: false,
		value: Stats,
		writable: true
	}
});

Object.defineProperty(Stats, 'super_', {
	configurable: true,
	enumerable: false,
	value: fs.Stats,
	writable: true
});

// getTime/setTime using the constructor names
Object.defineProperties(Stats.prototype, {
	atim_msec: {
		configurable: true,
		enumerable: false,
		get: function() {
			return this.atime.getTime();
		},
		set: function(value) {
			this.atime.setTime(value);
		}
	},
	mtim_msec: {
		configurable: true,
		enumerable: false,
		get: function() {
			return this.mtime.getTime();
		},
		set: function(value) {
			this.mtime.setTime(value);
		}
	},
	ctim_msec: {
		configurable: true,
		enumerable: false,
		get: function() {
			return this.ctime.getTime();
		},
		set: function(value) {
			this.ctime.setTime(value);
		}
	},
	birthtim_msec: {
		configurable: true,
		enumerable: false,
		get: function() {
			return this.birthtime.getTime();
		},
		set: function(value) {
			this.birthtime.setTime(value);
		}
	}
});
