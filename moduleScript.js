function init() {
  request();
}

function moduleParameterChanged(param) {
  script.log(param.name + " parameter changed");

  if (param.isParameter()) {
    if (param.name === "ipAddress"){
      local.parameters.baseAddress.set("http://"+param.get()+"/api");
    }
  }
}

function moduleValueChanged(value) {
  script.log(value.name + " value changed");

  if (!value.isParameter()) {
    // if it is a trigger
    if (value.name === "powerOn") powerOn();
    else if (value.name === "standby") standby();
  }
}



// Here are the callback functions for the commands

function powerOn() {
  var params = {};
  params.dataType = "json";
  params.extraHeaders = "Content-Type: application/json";

  var payload = {}; //the payload can be either a simple string or an object that will be automatically stringified
  payload.standby = "false";
  params.payload = payload;
  local.sendPOST("/power", params);
}

function standby() {
  var params = {};
  params.dataType = "json";
  params.extraHeaders = "Content-Type: application/json";

  var payload = {}; //the payload can be either a simple string or an object that will be automatically stringified
  payload.standby = "true";
  params.payload = payload;
  local.sendPOST("/power", params);
}

function request(){
  local.sendGET("/power/standby", "raw");
}

// Callback function for data received

function dataEvent(data, requestURL){
  if (requestURL === (local.parameters.baseAddress.get() + "/power/standby")){
    script.log("received power status  " + data);
    if (data === "true"){
      res = true;
    } else {
      res = false;
    }
    local.values.standbyStatus.set(res);
  } else if (requestURL === (local.parameters.baseAddress.get() + "/power")){
    script.log("received power status  " + data);
    script.log(data.standby);
    local.values.standbyStatus.set(data.standby);
  }
}