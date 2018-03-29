# stats-ctor [![Build Status](https://travis-ci.org/CodeMan99/stats-ctor.svg?branch=master)](https://travis-ci.org/CodeMan99/stats-ctor)

`fs.Stats` constructor with a sane signature and defaults.

## Usage

Sane defaults.

```javascript
var Stats = require('stats-ctor');
var stat = new Stats();

console.log(stat.mode);  // 0
console.log(stat.uid);   // 1000  -   from `process.getuid()`
console.log(stat.mtime); // 2018-03-29T17:01:48.883Z  -  from `new Date()`
```

Sane single argument signature.

```javascript
var fs = require('fs');
var Stats = require('stats-ctor');
var umask = 0o002;
var stat = new Stats({
	mode: fs.constats.S_IFREG | (umask ^ 0o777)
});

console.log(stat.mode); // 33277
```

Free copy constructor.

```javascript
var fs = require('fs');
var Stats = require('stats-ctor');
var stat = fs.statSync('./README.md');
var copy = new Stats(stat);

console.log(stat === copy); // false
console.log(stat.mtime.getTime() === copy.mtime.getTime()); // true  -  same for all properties on the copy instance
```

## API

### Stats([options])

Identical to the `fs.Stats` constructor in node core, except it has a single options argument instead of fourteen named arguments.

#### options

Type: `Object`

Simply uses the named arguments from `fs.Stats` as property names.

##### dev

Type: `Number`
<br>Default: `0`

##### mode

Type: `Number`
<br>Default: `0`

You should create a real mode for most use cases. See [`fs.constants`](https://nodejs.org/dist/latest/docs/api/fs.html#fs_file_type_constants). For example when creating a new regular file do `fs.constants.S_IFREG | (process.umask() ^ 0o666)`.

##### nlink

Type: `Number`
<br>Default: `0`

##### uid

Type: `Number`
<br>Default: `process.getuid()`

##### gid

Type: `Number`
<br>Default: `process.getgid()`

##### rdev

Type: `Number`
<br>Default: `0`

##### blksize

Type: `Number`
<br>Default: `0`

##### ino

Type: `Number`
<br>Default: `0`

##### size

Type: `Number`
<br>Default: `0`

##### blocks

Type: `Number`
<br>Default: `0`

##### atim_msec

Type: `Number`
<br>Default: `Date.now()`

This property creates a `Date` instance called `atime`.

##### mtim_msec

Type: `Number`
<br>Default: `Date.now()`

This property creates a `Date` instance called `mtime`.

##### ctim_msec

Type: `Number`
<br>Default: `Date.now()`

This property creates a `Date` instance called `ctime`.

##### birthtim_msec

Type: `Number`
<br>Default: `Date.now()`

This property creates a `Date` instance called `birthtime`.

#### Stats.prototype.atim_msec

Type: `Number`

A millisecond getter/setter for `atime`.

#### Stats.prototype.mtim_msec

Type: `Number`

A millisecond getter/setter for `mtime`.

#### Stats.prototype.ctim_msec

Type: `Number`

A millisecond getter/setter for `ctime`.

#### Stats.prototype.birthtim_msec

Type: `Number`

A millisecond getter/setter for `birthtime`.

## Related

 * [clone-stats](https://github.com/hughsk/clone-stats) Copying existing `fs.Stats` instances.
 * [stat-mode](https://github.com/TooTallNate/stat-mode) Sane handling of the `mode` property.

## License

ISC - Copyright &copy; 2018, Cody A. Taylor.
