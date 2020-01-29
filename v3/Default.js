'use strict';

var utils = require('../../utils/writer');
var DefaultV3 = require('../../service/DefaultServiceV3');

module.exports.generated = function generated(req, res, next) {
  var from = req.swagger.params['from'].value;
  var to = req.swagger.params['to'].value;
  var node = req.swagger.params['node'].value;
  var namespace = req.swagger.params['namespace'].value;
  var pod_name = req.swagger.params['pod_name'].value;
  var metric_name = req.swagger.params['metric_name'].value;
  DefaultV3.generated(from, to, node, namespace, pod_name, metric_name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};