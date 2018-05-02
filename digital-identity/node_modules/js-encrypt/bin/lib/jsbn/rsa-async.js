"use strict";

var _rng = require("./rng");

var _jsbn = require("./jsbn");

var _rsa = require("./rsa");

// Generate a new random private key B bits long, using public expt E
_rsa.RSAKey.prototype.generateAsync = function (B, E, callback) {
    //var rng = new SeededRandom();
    var rng = new _rng.SecureRandom();
    var qs = B >> 1;
    this.e = parseInt(E, 16);
    var ee = new _jsbn.BigInteger(E, 16);
    var rsa = this;
    // These functions have non-descript names because they were originally for(;;) loops.
    // I don't know about cryptography to give them better names than loop1-4.
    var loop1 = function loop1() {
        var loop4 = function loop4() {
            if (rsa.p.compareTo(rsa.q) <= 0) {
                var t = rsa.p;
                rsa.p = rsa.q;
                rsa.q = t;
            }
            var p1 = rsa.p.subtract(_jsbn.BigInteger.ONE);
            var q1 = rsa.q.subtract(_jsbn.BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(_jsbn.BigInteger.ONE) == 0) {
                rsa.n = rsa.p.multiply(rsa.q);
                rsa.d = ee.modInverse(phi);
                rsa.dmp1 = rsa.d.mod(p1);
                rsa.dmq1 = rsa.d.mod(q1);
                rsa.coeff = rsa.q.modInverse(rsa.p);
                setTimeout(function () {
                    callback();
                }, 0); // escape
            } else {
                setTimeout(loop1, 0);
            }
        };
        var loop3 = function loop3() {
            rsa.q = nbi();
            rsa.q.fromNumberAsync(qs, 1, rng, function () {
                rsa.q.subtract(_jsbn.BigInteger.ONE).gcda(ee, function (r) {
                    if (r.compareTo(_jsbn.BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                        setTimeout(loop4, 0);
                    } else {
                        setTimeout(loop3, 0);
                    }
                });
            });
        };
        var loop2 = function loop2() {
            rsa.p = nbi();
            rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                rsa.p.subtract(_jsbn.BigInteger.ONE).gcda(ee, function (r) {
                    if (r.compareTo(_jsbn.BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                        setTimeout(loop3, 0);
                    } else {
                        setTimeout(loop2, 0);
                    }
                });
            });
        };
        setTimeout(loop2, 0);
    };
    setTimeout(loop1, 0);
};

// Public API method
// Copyright (c) 2011  Kevin M Burns Jr.
// All Rights Reserved.
// See "LICENSE" for details.
//
// Extension to jsbn which adds facilities for asynchronous RSA key generation
// Primarily created to avoid execution timeout on mobile devices
//
// http://www-cs-students.stanford.edu/~tjw/jsbn/
//
// ---

var bnGCDAsync = function bnGCDAsync(a, callback) {
    var x = this.s < 0 ? this.negate() : this.clone();
    var y = a.s < 0 ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
    }
    var i = x.getLowestSetBit(),
        g = y.getLowestSetBit();
    if (g < 0) {
        callback(x);
        return;
    }
    if (i < g) g = i;
    if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
    }
    // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
    var gcda1 = function gcda1() {
        if ((i = x.getLowestSetBit()) > 0) {
            x.rShiftTo(i, x);
        }
        if ((i = y.getLowestSetBit()) > 0) {
            y.rShiftTo(i, y);
        }
        if (x.compareTo(y) >= 0) {
            x.subTo(y, x);
            x.rShiftTo(1, x);
        } else {
            y.subTo(x, y);
            y.rShiftTo(1, y);
        }
        if (!(x.signum() > 0)) {
            if (g > 0) y.lShiftTo(g, y);
            setTimeout(function () {
                callback(y);
            }, 0); // escape
        } else {
            setTimeout(gcda1, 0);
        }
    };
    setTimeout(gcda1, 10);
};
_jsbn.BigInteger.prototype.gcda = bnGCDAsync;

// (protected) alternate constructor
var bnpFromNumberAsync = function bnpFromNumberAsync(a, b, c, callback) {
    if ("number" == typeof b) {
        if (a < 2) {
            this.fromInt(1);
        } else {
            this.fromNumber(a, c);
            if (!this.testBit(a - 1)) {
                this.bitwiseTo(_jsbn.BigInteger.ONE.shiftLeft(a - 1), op_or, this);
            }
            if (this.isEven()) {
                this.dAddOffset(1, 0);
            }
            var bnp = this;
            var bnpfn1 = function bnpfn1() {
                bnp.dAddOffset(2, 0);
                if (bnp.bitLength() > a) bnp.subTo(_jsbn.BigInteger.ONE.shiftLeft(a - 1), bnp);
                if (bnp.isProbablePrime(b)) {
                    setTimeout(function () {
                        callback();
                    }, 0); // escape
                } else {
                    setTimeout(bnpfn1, 0);
                }
            };
            setTimeout(bnpfn1, 0);
        }
    } else {
        var x = [],
            t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0) x[0] &= (1 << t) - 1;else x[0] = 0;
        this.fromString(x, 256);
    }
};
_jsbn.BigInteger.prototype.fromNumberAsync = bnpFromNumberAsync;