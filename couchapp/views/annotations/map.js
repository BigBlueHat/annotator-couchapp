function(doc) {
  if ('uri' in doc && 'ranges' in doc) {
    emit(doc.uri, 1);
  }
}
