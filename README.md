# Annotator CouchApp

[AnnotatorJS](http://annotatorjs.org/) provides a
[Store plugin](http://docs.annotatorjs.org/en/latest/plugins/store.html)
which inturn uses a simple
[Storage API](http://docs.annotatorjs.org/en/latest/storage.html)
that (thankfully!) maps quite nicely to [Apache CouchDB](http://couchdb.apache.org/)'s.

So...I built a [CouchApp](http://github.com/couchapp) to fill in the missing bits.

## Install

1. Download [couchapp.py](http://github.com/couchapp/couchapp) (or something that
supports the [CouchApp File System Mapping](https://github.com/couchapp/couchapp/wiki/Complete-Filesystem-to-Design-Doc-Mapping-Example))
2. `couchapp push . http://localhost:5984/annotator`
3. Add this (or similar) code to an HTML page hosted form that database (or that can write to it
...see [CORS](http://docs.couchdb.org/en/latest/config/http.html?highlight=bind_address#config-cors))
```
var annotator = $('#content').annotator();
annotator.annotator('addPlugin', 'Store', {
  prefix: 'http://localhost:5984/annotator/_design/annotator/_rewrite'
});
```

## Early days, yet.

AnnotatorJS has plugins for Auth, Permissions, and a few other Storage-facing
things. It'd be super to add support for them here.

Patches welcome!

## License

Apache License 2.0
