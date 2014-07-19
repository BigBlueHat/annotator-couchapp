function(head, req) {
  var rows = [];
  var tmpdoc = {};

  start({
    headers: {
      'Content-Type': 'application/json'
    }
  });
  while(row = getRow()) {
    tmpdoc = row.doc;
    tmpdoc['id'] = tmpdoc._id;
    rows.push(tmpdoc);
  }
  send(JSON.stringify(rows));
}
