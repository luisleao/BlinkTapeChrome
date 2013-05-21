/*
Copyright 2012 Luis Fernando de Oliveira Leao.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Luis Leao (luisleao@gmail.com)
*/


console.log("test");

var controller = (function(){

  console.log("initializing!");


  var openSerial=function(serialPort, bitrate, callback) {
    if (!serialPort) {
      logError("Invalid serialPort");
      return;
    }
    if (callback) open_callback = callback;

    serial_lib.openSerial(serialPort, bitrate, function(){

        console.log("openned!");

        var size = 60;
        window.x = 0;
        window.c = 254;
        window.index = 0;

        window.serialPort = serialPort;
        var buf=new ArrayBuffer(size*3+1);
        var bufView=new Uint8Array(buf);
        for (var i=0; i<size*3; i=i+3) {
          bufView[i]= 254 * Math.random();
          bufView[i+1]= 254 * Math.random();
          bufView[i+2]= 254 * Math.random();
        }
        bufView[size*3] = 255;

        window.b = bufView;
        window.buf = buf;


        self.setInterval(function(){
          window.x = window.x + 3;
          if(window.x>=size*3) {
            window.x = 0;
            window.c = window.c == 254 ? 0 : 254;
          }

          for (var i=0; i<size*3; i=i+1) {
            if (i == window.x+window.index) {
              window.b[i]= window.c; //254 * Math.random();
            } else {
              window.b[i]= 0;

            }
          }
          chrome.serial.write(window.connectionInfo.connectionId, window.buf, function(){});

        }, 10);

    });
  };



  var init=function() {

    console.log("init");

    serial_lib.getPorts(function(ports) {
      for (var i=0; i<ports.length; i++) {
         if (/usb/i.test(ports[i]) && /tty/i.test(ports[i])) {
          console.log(ports[i]);
          var serial_port = ports[i];
          openSerial(serial_port, 115200); //set serial port bitrate
          return;
        }
      }
    });

  };



  //TODO: descomentar para funcionar ilumiChrome
  init();

})();



