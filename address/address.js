function isPostalCode(s) {
  return s.toUpperCase().match(
    /[A-Z][0-9][A-Z]\s*[0-9][A-Z][0-9]/i);
}

MPC.addEvent(window, 'load', function() {
  var postalCode = MPC.$('postalCode');
  postalCode.className = 'inputMissing';
  MPC.addEvent(postalCode, 'focus', function(event) {
    this.className = 'inputEditing';
  });

  MPC.addEvent(postalCode, 'change', function() {
    var newPostalCode = this.value;
    if (!isPostalCode(newPostalCode)) return;

    var req = new XMLHttpRequest();
    req.open('POST', 'server.js', true);
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        var res = JSON.parse(req.responseText);
        console.log(res);
        if (MPC.$('street').value === '') {
          MPC.$('street').value = res.street;
        }
        if (MPC.$('city').value === '') {
          MPC.$('city').value = res.city;
        }
        if (MPC.$('province').value === '') {
          MPC.$('province').value = res.province;
        }
      }
    };
    req.send();
  });

  MPC.addEvent(postalCode, 'blur', function(event) {
    if (this.value === '') {
      this.className = 'inputMissing';
    } else if (!isPostalCode(this.value)) {
      this.className = 'inputInvalid';
    } else {
      this.className = 'inputComlete';
    }
  });
  MPC.addEvent(
    document.getElementById('cAddress'),
    'submit',
    function(event) {
      var postalCodeValue = postalCode.value;
      if (!isPostalCode(postalCodeValue)) {
        alert('That\'s not a valid Canadian postal Code!');
        MPC.preventDefault(event);
      }
    }
  );

});