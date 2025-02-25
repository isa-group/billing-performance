"use strict";

const request = require("request");
const moment = require("moment");

const config = require("../configurations");
const logger = require("../logger");


var buildQuery = (query, node, pod_name, namespace) => {
  if (node) {
    query = query + ' and "nodename" =~ /^' + node + "/";
  };
  if (pod_name) {
    query = query + ' and "pod_name" =~ /^' + pod_name + "/";
  };
  if (namespace) {
    query = query + ' and "namespace" =~ /^' + namespace + "/";
  };
  return (query);
};

exports.generated = function (from, to, node, namespace, pod_name, metric_name) {
  console.log(metric_name);
  return new Promise(function (resolve, reject) {
    var fromDate = moment(from);
    var toDate = moment(to);
    var query = 'select mean("value") from "'+ metric_name.toString()+'" where time > \'' + fromDate.toISOString() + "'";
    if (to) {
      if (from > to) {
        response = {
          res: 400,
          response: "from is bigger that end"
        };
        reject(response);
      } else {
        query = query + ' and time <= \'' + toDate.toISOString() + '\'';
        query = buildQuery(query, node, pod_name, namespace);
        logger.info("query: " + query);
      }
    } else {
      query = buildQuery(query, node, pod_name, namespace);
      logger.info("query: " + query);
    }
    query = query.replace(/&amp;/g, "&")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&quot;/g, '"');
    var response;
    request({
        method: "POST",
        url: config.data.apiInfluxdb,
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        form: {
          q: query,
          db: "k8s"
        }
      },
      (err, res, body) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        if (body === '{"results":[{"statement_id":0}]}\n') {
          response = {
            res: 404,
            response: "Please check the parameters, as no information is found "
          };
        } else {
          logger.info(res.statusCode);
          logger.info(body);
          response = {
            res: res.statusCode,
            response: {
              value: (JSON.parse(body).results[0].series[0].values[0][1]).toFixed(2),
              measurementUnit: 'GB'
            }
          };
        }
        resolve(response);
      });
  });
};

exports.podNumber = function (from, to, node, namespace, pod_name) {
  return new Promise(function (resolve, reject) {
    var toDate = moment(to);
    var query = 'SELECT distinct(pod_number) FROM "restart_count" WHERE time > \'' + from.toISOString() + '\'';
    if (to) {
      if (from > to) {
        response = {
          res: 400,
          response: "from is bigger that end"
        };
        reject(response);
      } else {
        query = query + ' and time <= \'' + toDate.toISOString() + '\'';
        query = buildQuery(query, node, pod_name, namespace);
        query = query + " GROUP BY time(30d);";
        logger.info("query: " + query);
      }
    } else {
      query = buildQuery(query, node, pod_name, namespace);
      query = query + ' GROUP BY time(30d);';
      logger.info("query: " + query);
    }
    // query = query + ' GROUP BY time(30d);';
    query = query.replace(/&amp;/g, "&")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&quot;/g, '"');
    var response;
    request({
        method: "POST",
        url: config.data.apiInfluxdb,
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        form: {
          q: query,
          db: "k8s"
        }
      },
      (err, res, body) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        if (body === '{"results":[{"statement_id":0}]}\n') {
          response = {
            res: 404,
            response: "Please check the parameters, as no information is found "
          };
        } else {
          logger.info(res.statusCode);
          var size = JSON.parse(body).results[0].series[0].values.length;
          logger.info(size);
          response = {
            res: res.statusCode,
            response: {
              value: size,
            }
          };
        }
        resolve(response);
      });
  });
};


exports.numberDays = function (from, to) {
  return new Promise(function (resolve, reject) {
    var response;
    var fromDate = moment(from);
    var toDate = moment(to);
    if (from > to) {
      response = {
        res: 400,
        response: "from is bigger that end"
      };
      return reject(response);
    } else {
      var days = toDate.diff(fromDate, 'days');
      response = {
        res: 200,
        response: days
      };
      return resolve(response);
    }
  });
};

var buildQuery = (query, node, pod_name, namespace) => {
  if (node) {
    query = query + ' and "nodename" =~ /^' + node + "/";
  };
  if (pod_name) {
    query = query + ' and "pod_name" =~ /^' + pod_name + "/";
  };
  if (namespace) {
    query = query + ' and "namespace" =~ /^' + namespace + "/";
  };
  return (query);
};