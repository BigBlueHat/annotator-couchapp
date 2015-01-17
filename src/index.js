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
