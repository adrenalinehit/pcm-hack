/*
 Copyright (c) 2012, Intel Corporation

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var lcdLibrary = require('jsupm_i2clcd');
var lcd = new lcdLibrary.Jhd1313m1(0, 0x3E, 0x62);
lcd.setCursor(0, 0);
lcd.write('Comfort level   ');
lcd.setColor(255, 255, 255);

var temperatureSensor = new mraa.Aio(0);
var airQualitySensor = new mraa.Aio(1);
var soundSensor = new mraa.Aio(2);

var comfortLevel;

var temperatureRange = 40;
var temperaturePerfect = 18;

var soundRange = 1023;
var soundPerfect = 200;

var airQualityRange = 1023;
var airQualityPefect = 10;

var blueLed = new mraa.Gpio(2);
blueLed.dir(mraa.DIR_OUT);
var redLed = new mraa.Gpio(3);
redLed.dir(mraa.DIR_OUT);
var greenLed = new mraa.Gpio(4);
greenLed.dir(mraa.DIR_OUT);

blueLed.write(0);
redLed.write(0);
greenLed.write(0);

var net = require('net');
var client = new net.Socket();

var temperatureSensorB = 3975;  // "B value of the thermistor"

var tcpOptions = {
    host: 'localhost',
    port: 7070
};

function sendObservation(name, value, on){
    var msg = JSON.stringify({
        n: name,
        v: value,
        on: on
    });
    
    var sentMsg = msg.length + "#" + msg;
    console.log("Sending observation: " + sentMsg);
    client.write(sentMsg);
};

function doSend() {
    var rawTemperature = temperatureSensor.read();
    var airQuality = airQualitySensor.read();
    var sound = soundSensor.read();
    
    var resistance=(1023-rawTemperature)*10000/rawTemperature; // get the resistance of the sensor
    var temperature=1/(Math.log(resistance/10000)/temperatureSensorB+1/298.15)-273.15; // convert to temperature via datasheet
    
    comfortLevel = Math.min(Math.max(1 - (
            (temperature - temperaturePerfect) / temperatureRange +
            (airQuality - airQualityPefect) / airQualityRange +
            (sound - soundPerfect) / soundRange
        ), 0), 1);
    
    redLed.write(comfortLevel < 0.5 ? 1 : 0);

    lcd.setCursor(1, 0);
    lcd.write(Math.round(comfortLevel * 100) + "   ");
    var greenBlue = comfortLevel * 255;
    lcd.setColor(255, greenBlue, greenBlue);
    
    console.log("T: " + temperature + "; AQ: " + airQuality + "; S: " + sound + "; CL: " + comfortLevel);

    var now = new Date().getTime();
    var data = [
        {
            sensorName : "temp",
            sensorType: "temperature.v1.0",
            observations: [{
                on: now,
                value: temperature
            }]
        },
        {
            sensorName : "sound",
            sensorType: "sound.v1.0",
            observations: [{
                on: now,
                value: sound
            }]
        },
        {
            sensorName : "airquality",
            sensorType: "airquality.v1.0",
            observations: [{
                on: now,
                value: airQuality
            }]
        },
        {
            sensorName : "comfortlevel",
            sensorType: "comfortlevel.v1.0",
            observations: [{
                on: now,
                value: comfortLevel
            }]
        }
        ];
    data.forEach(function(item) {
        item.observations.forEach(function (observation) {
            sendObservation(item.sensorName, observation.value, observation.on);
        });
    });
    setTimeout(doSend, 1000);
};

client.connect(tcpOptions.port, tcpOptions.host, function() {
    console.log("Connected!");
    doSend();
});
