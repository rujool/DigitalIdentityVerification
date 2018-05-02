"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RSAKey = undefined;

var _rsa = require("./rsa");

Object.defineProperty(exports, "RSAKey", {
  enumerable: true,
  get: function get() {
    return _rsa.RSAKey;
  }
});

var _rng = require("./rng");

var _jsbn = require("./jsbn");

function pkcs1unpad2(d, n) {
  var b = d.toByteArray();
  var i = 0;
  while (i < b.length && b[i] == 0) {
    ++i;
  }if (b.length - i != n - 1 || b[i] != 2) return null;
  ++i;
  while (b[i] != 0) {
    if (++i >= b.length) return null;
  }var ret = "";
  while (++i < b.length) {
    var c = b[i] & 255;
    if (c < 128) {
      // utf-8 decode
      ret += String.fromCharCode(c);
    } else if (c > 191 && c < 224) {
      ret += String.fromCharCode((c & 31) << 6 | b[i + 1] & 63);
      ++i;
    } else {
      ret += String.fromCharCode((c & 15) << 12 | (b[i + 1] & 63) << 6 | b[i + 2] & 63);
      i += 2;
    }
  }
  return ret;
}

// Set the private key fields N, e, and d from hex strings
function RSASetPrivate(N, E, D) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = (0, _rsa.parseBigInt)(N, 16);
    this.e = parseInt(E, 16);
    this.d = (0, _rsa.parseBigInt)(D, 16);
  } else console.error("Invalid RSA private key");
}

// Set the private key fields N, e, d and CRT params from hex strings
function RSASetPrivateEx(N, E, D, P, Q, DP, DQ, C) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = (0, _rsa.parseBigInt)(N, 16);
    this.e = parseInt(E, 16);
    this.d = (0, _rsa.parseBigInt)(D, 16);
    this.p = (0, _rsa.parseBigInt)(P, 16);
    this.q = (0, _rsa.parseBigInt)(Q, 16);
    this.dmp1 = (0, _rsa.parseBigInt)(DP, 16);
    this.dmq1 = (0, _rsa.parseBigInt)(DQ, 16);
    this.coeff = (0, _rsa.parseBigInt)(C, 16);
  } else console.error("Invalid RSA private key");
}

// Generate a new random private key B bits long, using public expt E
function RSAGenerate(B, E) {
  var rng = new _rng.SecureRandom();
  var qs = B >> 1;
  this.e = parseInt(E, 16);
  var ee = new _jsbn.BigInteger(E, 16);
  for (;;) {
    for (;;) {
      this.p = new _jsbn.BigInteger(B - qs, 1, rng);
      if (this.p.subtract(_jsbn.BigInteger.ONE).gcd(ee).compareTo(_jsbn.BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
    }
    for (;;) {
      this.q = new _jsbn.BigInteger(qs, 1, rng);
      if (this.q.subtract(_jsbn.BigInteger.ONE).gcd(ee).compareTo(_jsbn.BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
    }
    if (this.p.compareTo(this.q) <= 0) {
      var t = this.p;
      this.p = this.q;
      this.q = t;
    }
    var p1 = this.p.subtract(_jsbn.BigInteger.ONE);
    var q1 = this.q.subtract(_jsbn.BigInteger.ONE);
    var phi = p1.multiply(q1);
    if (phi.gcd(ee).compareTo(_jsbn.BigInteger.ONE) == 0) {
      this.n = this.p.multiply(this.q);
      this.d = ee.modInverse(phi);
      this.dmp1 = this.d.mod(p1);
      this.dmq1 = this.d.mod(q1);
      this.coeff = this.q.modInverse(this.p);
      break;
    }
  }
}

// Perform raw private operation on "x": return x^d (mod n)
function RSADoPrivate(x) {
  if (this.p == null || this.q == null) return x.modPow(this.d, this.n);

  // TODO: re-calculate any missing CRT params
  var xp = x.mod(this.p).modPow(this.dmp1, this.p);
  var xq = x.mod(this.q).modPow(this.dmq1, this.q);

  while (xp.compareTo(xq) < 0) {
    xp = xp.add(this.p);
  }return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
}

// Return the PKCS#1 RSA decryption of "ctext".
// "ctext" is an even-length hex string and the output is a plain string.
function RSADecrypt(ctext) {
  var c = (0, _rsa.parseBigInt)(ctext, 16);
  var m = this.doPrivate(c);
  if (m == null) return null;
  return pkcs1unpad2(m, this.n.bitLength() + 7 >> 3);
}

// Return the PKCS#1 RSA decryption of "ctext".
// "ctext" is a Base64-encoded string and the output is a plain string.
//function RSAB64Decrypt(ctext) {
//  var h = b64tohex(ctext);
//  if(h) return this.decrypt(h); else return null;
//}

// protected
_rsa.RSAKey.prototype.doPrivate = RSADoPrivate;

// public
_rsa.RSAKey.prototype.setPrivate = RSASetPrivate;
_rsa.RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
_rsa.RSAKey.prototype.generate = RSAGenerate;
_rsa.RSAKey.prototype.decrypt = RSADecrypt;
//RSAKey.prototype.b64_decrypt = RSAB64Decrypt;