var i = 0;
  var txt = 'safe password generator';
  var speed = 150;

  function typeWriter() {
    if (i < txt.length) {
      document.getElementById("maintext").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

window.onload = typeWriter;



// 

