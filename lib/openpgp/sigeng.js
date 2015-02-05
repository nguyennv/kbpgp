// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var C, SignatureEngine, burn, decode, iced, make_esc, processor, __iced_k, __iced_k_noop;

  iced = require('iced-runtime').iced;
  __iced_k = __iced_k_noop = function() {};

  make_esc = require('iced-error').make_esc;

  burn = require('./burner').burn;

  processor = require('./processor');

  decode = require('./armor').decode;

  C = require('../const');

  exports.SignatureEngine = SignatureEngine = (function() {
    function SignatureEngine(_arg) {
      this.km = _arg.km;
    }

    SignatureEngine.prototype.get_km = function() {
      return this.km;
    };

    SignatureEngine.prototype.box = function(msg, cb) {
      var err, out, signing_key, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      out = {
        type: "pgp"
      };
      (function(_this) {
        return (function(__iced_k) {
          if ((signing_key = _this.km.find_signing_pgp_key()) != null) {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/max/src/keybase/kbpgp/src/openpgp/sigeng.iced",
                funcname: "SignatureEngine.box"
              });
              burn({
                msg: msg,
                signing_key: signing_key
              }, __iced_deferrals.defer({
                assign_fn: (function(__slot_1, __slot_2) {
                  return function() {
                    err = arguments[0];
                    __slot_1.pgp = arguments[1];
                    return __slot_2.raw = arguments[2];
                  };
                })(out, out),
                lineno: 21
              }));
              __iced_deferrals._fulfill();
            })(function() {
              return __iced_k(typeof err === "undefined" || err === null ? out.armored = out.pgp : void 0);
            });
          } else {
            return __iced_k(err = new Error("No signing key found"));
          }
        });
      })(this)((function(_this) {
        return function() {
          return cb(err, out);
        };
      })(this));
    };

    SignatureEngine.prototype.decode = function(armored, cb) {
      var err, msg, mt, _ref;
      _ref = decode(armored), err = _ref[0], msg = _ref[1];
      mt = C.openpgp.message_types;
      if ((err == null) && (msg.type !== mt.generic)) {
        err = new Error("wrong message type; expected a generic message; got " + msg.type);
      }
      return cb(err, msg);
    };

    SignatureEngine.prototype.unbox = function(msg, cb) {
      var eng, esc, literals, msg, payload, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "SignatureEngine::unbox");
      (function(_this) {
        return (function(__iced_k) {
          if (typeof msg === 'string') {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/max/src/keybase/kbpgp/src/openpgp/sigeng.iced",
                funcname: "SignatureEngine.unbox"
              });
              _this.decode(msg, esc(__iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return msg = arguments[0];
                  };
                })(),
                lineno: 40
              })));
              __iced_deferrals._fulfill();
            })(__iced_k);
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          eng = new processor.Message({
            keyfetch: _this.km
          });
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/max/src/keybase/kbpgp/src/openpgp/sigeng.iced",
              funcname: "SignatureEngine.unbox"
            });
            eng.parse_and_process({
              body: msg.body
            }, esc(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return literals = arguments[0];
                };
              })(),
              lineno: 42
            })));
            __iced_deferrals._fulfill();
          })(function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/max/src/keybase/kbpgp/src/openpgp/sigeng.iced",
                funcname: "SignatureEngine.unbox"
              });
              _this._check_result(literals, esc(__iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return payload = arguments[0];
                  };
                })(),
                lineno: 43
              })));
              __iced_deferrals._fulfill();
            })(function() {
              return cb(null, payload, msg.body);
            });
          });
        };
      })(this));
    };

    SignatureEngine.prototype._check_result = function(literals, cb) {
      var b, err, l, n, payload, sw, _ref;
      err = payload = null;
      if ((n = literals.length) !== 1 || ((l = literals[0]) == null)) {
        err = new Error("Expected only one pgp literal; got " + n);
      } else if ((sw = (_ref = l.get_data_signer()) != null ? _ref.sig : void 0) == null) {
        err = new Error("Expected a signature on the payload message");
      } else if ((this.km.find_pgp_key((b = sw.get_key_id()))) == null) {
        err = new Error("Failed sanity check; didn't have a key for '" + (b.toString('hex')) + "'");
      } else {
        payload = l.data;
      }
      return cb(err, payload);
    };

    return SignatureEngine;

  })();

}).call(this);