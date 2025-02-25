'use strict';

var utils = require('../../utils/writer');
var Default = require('../../service/DefaultServiceV1');
var DefaultV2 = require('../../service/DefaultServiceV2');
var DefaultV3 = require('../../service/DefaultServiceV3');

module.exports.availability = function availability(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  Default.availability(from, to, node)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.cpu = function cpu(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  Default.cpu(from, to, node)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.disk = function disk(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  Default.disk(from, to)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.memoryRam = function memoryRam(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  Default.memoryRam(from, to, node)
    .then(response => {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
//V2

module.exports.avgAvailability = function avgAvailability(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  var namespace = req.swagger.params['namespace'].value;
  var pod_name = req.swagger.params['pod_name'].value;
  DefaultV2.avgAvailability(from, to, node, namespace, pod_name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.cpuLoad = function cpuLoad(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  var namespace = req.swagger.params['namespace'].value;
  var pod_name = req.swagger.params['pod_name'].value;
  DefaultV2.cpuLoad(from, to, node, namespace, pod_name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.diskSpace = function diskSpace(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  DefaultV2.diskSpace(from, to)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.avgMemoryRam = function avgMemoryRam(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  var namespace = req.swagger.params['namespace'].value;
  var pod_name = req.swagger.params['pod_name'].value;
  DefaultV2.avgMemoryRam(from, to, node, namespace, pod_name)
    .then(response => {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.podNumber = function podNumber(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  var namespace = req.swagger.params['namespace'].value;
  var pod_name = req.swagger.params['pod_name'].value;
  DefaultV2.podNumber(from, to, node, namespace, pod_name)
    .then(response => {
      utils.writeJson(res, response, node, namespace, pod_name);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.numberDays = function numberDays(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  DefaultV2.numberDays(from, to)
    .then(response => {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.generated = function generated(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  var namespace = req.swagger.params['namespace'].value;
  var pod_name = req.swagger.params['pod_name'].value;
  var metric_name = req.swagger.params['metric_name'].value;
  console.log(metric_name);
  DefaultV3.generated(from, to, node, namespace, pod_name, metric_name)
    .then(response => {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.podNumber = function podNumber(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  var namespace = req.swagger.params['namespace'].value;
  var pod_name = req.swagger.params['pod_name'].value;
  DefaultV3.podNumber(from, to, node, namespace, pod_name)
    .then(response => {
      utils.writeJson(res, response, node, namespace, pod_name);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.numberDays = function numberDays(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  DefaultV3.numberDays(from, to)
    .then(response => {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};