"use strict";

var $ = require('annotator').util.$;
var PouchDB = require('pouchdb');
window.PouchDB = PouchDB;

// PouchDBStorage is a storage component that uses PouchDB to store annotations
// in the browser and synchronize them to a remote CouchDB instance.
function PouchDBStorage (options) {
  // db is now a string; upgrade it to a PouchDB
  var db = PouchDB(options);
  // by URI filtering
  var ddoc = {
    _id: '_design/annotator',
    views: {
      annotations: {
        map: function(doc) {
          if ('uri' in doc && 'ranges' in doc) {
            emit(doc.uri, 1);
          }
        }.toString()
      }
    }
  };
  db.put(ddoc)
    .catch(function(err) {
      if (err.status !== 409) {
        throw err;
      }
      // ignore if doc already exists
    });

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

// `options` are straight-up PouchDB options at this point
exports.pouch = function pouch(options) {
  var storage = new PouchDBStorage(options);
  return {
    configure: function (registry) {
      registry.registerUtility(storage, 'storage');
    }
  };
};
