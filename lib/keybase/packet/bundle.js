// Generated by IcedCoffeeScript 1.6.3-g
(function() {
  var K, KeyBundle, KeyMaterial, Lifespan, Packet, Primary, PrivateKeyBundle, PublicKeyBundle, Subkey, UserIds, iced, katch, make_esc, sigmod, __iced_k, __iced_k_noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-coffee-script/lib/coffee-script/iced').runtime;
  __iced_k = __iced_k_noop = function() {};

  Packet = require('./base').Packet;

  K = require('../../const').kb;

  sigmod = require('./signature');

  _ref = require('../../keywrapper'), UserIds = _ref.UserIds, Primary = _ref.Primary, Subkey = _ref.Subkey, Lifespan = _ref.Lifespan;

  KeyMaterial = require('./keymaterial').KeyMaterial;

  katch = require('../../util').katch;

  make_esc = require('iced-error').make_esc;

  KeyBundle = (function(_super) {
    __extends(KeyBundle, _super);

    function KeyBundle(_arg) {
      this.primary = _arg.primary, this.subkeys = _arg.subkeys, this.tag = _arg.tag;
      this.primary || (this.primary = {});
      this.subkeys || (this.subkeys = []);
    }

    KeyBundle.prototype.frame_packet = function() {
      var body;
      body = {
        primary: this.primary,
        subkeys: this.subkeys
      };
      return KeyBundle.__super__.frame_packet.call(this, this.tag, body);
    };

    KeyBundle.prototype.set_primary = function(obj) {
      return this.primary = obj;
    };

    KeyBundle.prototype.push_subkey = function(sk) {
      return this.subkeys.push(sk);
    };

    KeyBundle.alloc = function(_arg) {
      var body, tag;
      tag = _arg.tag, body = _arg.body;
      if (body == null) {
        body = {};
      }
      switch (tag) {
        case K.packet_tags.public_key_bundle:
          return new PublicKeyBundle(body);
        case K.packet_tags.private_key_bundle:
          return new PrivateKeyBundle(body);
        default:
          throw new Error("not a key bundle (tag=" + tag + ")");
      }
    };

    KeyBundle.alloc_nothrow = function(obj) {
      return katch(function() {
        return KeyBundle.alloc(obj);
      });
    };

    KeyBundle.prototype.verify = function(_arg, cb) {
      var asp, err, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      asp = _arg.asp;
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/keybase/packet/bundle.iced",
          funcname: "KeyBundle.verify"
        });
        _this.verify_primary({
          asp: asp
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return err = arguments[0];
            };
          })(),
          lineno: 45
        }));
        __iced_deferrals._fulfill();
      })(function() {
        (function(__iced_k) {
          if (typeof err === "undefined" || err === null) {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/keybase/packet/bundle.iced",
                funcname: "KeyBundle.verify"
              });
              _this.verify_subkeys({
                asp: asp
              }, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return err = arguments[0];
                  };
                })(),
                lineno: 46
              }));
              __iced_deferrals._fulfill();
            })(__iced_k);
          } else {
            return __iced_k();
          }
        })(function() {
          return cb(err);
        });
      });
    };

    KeyBundle.prototype.export_to_obj = function() {
      return {
        primary: this.primary,
        userids: this.userids,
        subkeys: this.subkeys
      };
    };

    KeyBundle.prototype._verify_subkey = function(_arg, cb) {
      var asp, esc, sigs, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      asp = _arg.asp, sigs = _arg.sigs;
      esc = make_esc(cb, "KeyBundle::_verify_subkey");
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/keybase/packet/bundle.iced",
          funcname: "KeyBundle._verify_subkey"
        });
        sigs.fwd.verify(esc(__iced_deferrals.defer({
          lineno: 57
        })));
        __iced_deferrals._fulfill();
      })(function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/keybase/packet/bundle.iced",
            funcname: "KeyBundle._verify_subkey"
          });
          sigs.rev.verify(esc(__iced_deferrals.defer({
            lineno: 58
          })));
          __iced_deferrals._fulfill();
        })(function() {
          return cb(null);
        });
      });
    };

    KeyBundle.prototype._destructure_subkey = function(obj, cb) {
      var e, err, fwd, key_wrapper, ret, rev, subkey;
      ret = err = null;
      try {
        subkey = KeyMaterial.alloc(this.is_private(), obj.key);
        key_wrapper = new Subkey({
          key: subkey.key,
          _keybase: subkey,
          primary: this.primary
        });
        fwd = new sigmod.Subkey({
          subkey: key_wrapper,
          sig: obj.sigs.forward
        });
        rev = new sigmod.SubkeyReverse({
          subkey: key_wrapper,
          sig: obj.sigs.reverse
        });
        ret = {
          key_wrapper: key_wrapper,
          sigs: {
            fwd: fwd,
            rev: rev
          }
        };
      } catch (_error) {
        e = _error;
        err = e;
      }
      return cb(err, ret);
    };

    KeyBundle.prototype.verify_subkeys = function(_arg, cb) {
      var asp, esc, key_wrapper, obj, primary, ret, sigs, subkeys, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      primary = _arg.primary, asp = _arg.asp;
      esc = make_esc(cb, "KeyBundle::verify_subkeys");
      subkeys = this.subkeys;
      this.subkeys = [];
      ret = [];
      (function(__iced_k) {
        var _i, _len, _ref1, _results, _while;
        _ref1 = subkeys;
        _len = _ref1.length;
        _i = 0;
        _results = [];
        _while = function(__iced_k) {
          var _break, _continue, _next;
          _break = function() {
            return __iced_k(_results);
          };
          _continue = function() {
            return iced.trampoline(function() {
              ++_i;
              return _while(__iced_k);
            });
          };
          _next = function(__iced_next_arg) {
            _results.push(__iced_next_arg);
            return _continue();
          };
          if (!(_i < _len)) {
            return _break();
          } else {
            obj = _ref1[_i];
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/keybase/packet/bundle.iced",
                funcname: "KeyBundle.verify_subkeys"
              });
              _this._destructure_subkey(obj, esc(__iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    key_wrapper = arguments[0].key_wrapper;
                    return sigs = arguments[0].sigs;
                  };
                })(),
                lineno: 83
              })));
              __iced_deferrals._fulfill();
            })(function() {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "src/keybase/packet/bundle.iced",
                  funcname: "KeyBundle.verify_subkeys"
                });
                _this._verify_subkey({
                  asp: asp,
                  sigs: sigs
                }, esc(__iced_deferrals.defer({
                  lineno: 84
                })));
                __iced_deferrals._fulfill();
              })(function() {
                key_wrapper.lifespan = sigs.fwd.get_lifespan();
                return _next(ret.push(key_wrapper));
              });
            });
          }
        };
        _while(__iced_k);
      })(function() {
        _this.subkeys = ret;
        return cb(null);
      });
    };

    KeyBundle.prototype._destructure_primary = function(cb) {
      var e, err, key_wrapper, km, raw_obj, ret, sig;
      raw_obj = this.primary;
      this.primary = null;
      err = ret = null;
      try {
        km = KeyMaterial.alloc(this.is_private(), raw_obj.key);
        key_wrapper = new Primary({
          key: km.key,
          _keybase: km
        });
        sig = new sigmod.SelfSign({
          key_wrapper: key_wrapper,
          sig: raw_obj.sig
        });
        ret = {
          key_wrapper: key_wrapper,
          sig: sig
        };
      } catch (_error) {
        e = _error;
        err = e;
      }
      return cb(err, ret);
    };

    KeyBundle.prototype.verify_primary = function(_arg, cb) {
      var asp, esc, key_wrapper, sig, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      asp = _arg.asp;
      esc = make_esc(cb, "KeyBundle::verify_primary");
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/keybase/packet/bundle.iced",
          funcname: "KeyBundle.verify_primary"
        });
        _this._destructure_primary(esc(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              key_wrapper = arguments[0].key_wrapper;
              return sig = arguments[0].sig;
            };
          })(),
          lineno: 109
        })));
        __iced_deferrals._fulfill();
      })(function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "src/keybase/packet/bundle.iced",
            funcname: "KeyBundle.verify_primary"
          });
          sig.verify(esc(__iced_deferrals.defer({
            lineno: 110
          })));
          __iced_deferrals._fulfill();
        })(function() {
          _this.primary = key_wrapper;
          _this.primary.lifespan = sig.get_lifespan();
          _this.userids = new UserIds({
            keybase: sig.userid
          });
          return cb(null);
        });
      });
    };

    return KeyBundle;

  })(Packet);

  PublicKeyBundle = (function(_super) {
    __extends(PublicKeyBundle, _super);

    function PublicKeyBundle(_arg) {
      var primary, subkeys;
      primary = _arg.primary, subkeys = _arg.subkeys;
      PublicKeyBundle.__super__.constructor.call(this, {
        primary: primary,
        subkeys: subkeys,
        tag: K.packet_tags.public_key_bundle
      });
    }

    PublicKeyBundle.prototype.is_private = function() {
      return false;
    };

    return PublicKeyBundle;

  })(KeyBundle);

  PrivateKeyBundle = (function(_super) {
    __extends(PrivateKeyBundle, _super);

    function PrivateKeyBundle(_arg) {
      var primary, subkeys;
      primary = _arg.primary, subkeys = _arg.subkeys;
      PrivateKeyBundle.__super__.constructor.call(this, {
        primary: primary,
        subkeys: subkeys,
        tag: K.packet_tags.private_key_bundle
      });
    }

    PrivateKeyBundle.prototype.is_private = function() {
      return true;
    };

    return PrivateKeyBundle;

  })(KeyBundle);

  exports.PublicKeyBundle = PublicKeyBundle;

  exports.PrivateKeyBundle = PrivateKeyBundle;

  exports.KeyBundle = KeyBundle;

}).call(this);