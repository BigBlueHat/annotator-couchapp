/**
 * Currently only handing PUT (update) requests.
 **/
function(current_doc, req){
    if (!current_doc){
        // TODO: handle annotator object as defined
        if ('id' in req && req['id']){
            // create new document
            return [{'_id': req['id']}, 'New World']
        }
        // TODO: throw error about no doc
        return [null, 'Empty World']
    }
    // store doc, return it
    return [JSON.parse(req.body), {
      headers: {
        'Content-Type': 'application/json'
      },
      body: req.body
    }];
}
