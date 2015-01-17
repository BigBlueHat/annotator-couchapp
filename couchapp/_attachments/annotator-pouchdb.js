require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

// In order to build portable extension bundles that can be used with AMD and
// script concatenation plugins are built with this module as 'annotator'.
//
// Annotator will export itself globally when the built UMD modules are used in
// a legacy environment of simple script concatenation.

// Ignore the use of undefined variables
// jshint -W117

var Annotator,
    self;

function exists(x) {
    return (typeof x !== 'undefined' && x !== null);
}

if (!exists(self) && exists(global)) {
    self = global;
}
if (!exists(self) && exists(window)) {
    self = window;
}
// CommonJS/Browserify environment, used while testing. This allows us to `npm
// link` the current development version of Annotator into the
// annotator-plugintools package and have that used by the Karma test runner.
if (exists(self) && exists(require) && !exists(self.define)) {
    Annotator = require('annotator');
}
if (exists(self) && exists(self.Annotator)) {
    Annotator = self.Annotator;
}
// In a pure AMD environment, Annotator may not be exported globally.
if (!exists(Annotator) && exists(self.define) && exists(self.define.amd)) {
    Annotator = self.require('annotator');
}

// If we haven't successfully loaded Annotator by this point, there's no point
// in going on to load the plugin, so throw a fatal error.
if (typeof Annotator !== 'function') {
    throw new Error("Could not find Annotator! In a webpage context, please " +
                    "ensure that the Annotator script tag is loaded before " +
                    "any plugins.");
}


// Note: when working in a CommonJS environment and bundling requirements into
// applications then require calls should refer to modules from the npm lib
// directory of annotator package and avoid this altogether.
exports.Annotator = Annotator;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"annotator-pouchdb":[function(require,module,exports){
module.exports=require('2genGb');
},{}],"2genGb":[function(require,module,exports){
"use strict";

var Annotator = require('annotator-plugintools').Annotator;
var $ = Annotator.Util.$;

// PouchDBStorage is a storage component that uses PouchDB to store annotations
// in the browser and synchronize them to a remote CouchDB instance.
function PouchDBStorage (db) {
  return {
    'create': function (annotation) {
      var dfd = $.Deferred();
      annotation.id = PouchDB.utils.uuid();
      annotation._id = annotation.id;
      db.post(annotation, function(err, resp) {
        annotation._rev = resp.rev;
        dfd.resolve(annotation);
      });
      return dfd;
    },

    'update': function (annotation) {
      var dfd = $.Deferred();
      db.put(annotation, function(err, resp) {
        annotation._rev = resp.rev;
        dfd.resolve(annotation);
      });
      return dfd;
    },

    'delete': function (annotation) {
      var dfd = $.Deferred();
      db.remove(annotation, function(err, resp) {
        dfd.resolve(annotation);
      });
      return dfd;
    },

    'query': function (queryObj) {
      var dfd = $.Deferred();
      db.query('annotator/annotations',
        $.extend({reduce: false, include_docs: true}, queryObj),
        function(err, resp) {
          var annotations = [];
          for (var i = 0; i < resp.rows.length; i++) {
            annotations.push(resp.rows[i].doc);
          }
          dfd.resolve({
            results: annotations,
            metadata: {
              total: resp.rows.length
            }
          });
        });
      return dfd.promise();
    }
  };
}

exports.PouchDBStorage = PouchDBStorage;

},{"annotator-plugintools":2}]},{},[])