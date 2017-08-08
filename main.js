function doubleCheck() {
  this.message = 'Do you really want to leave?';
}
doubleCheck.prototype.sagGoodbye = function() {
  return cimfirm(this.message);
};

initPage() {
  var clickedLink = new doubleCheck();
  var links = document.getElementsBy
}
