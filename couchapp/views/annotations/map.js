function(doc) {
  if ('ranges' in doc) {
    emit(null, 1);
  }
}
