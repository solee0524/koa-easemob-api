/**
 * Created by solee on 7/15/16.
 */
'use strict';

var schema = {};

module.exports = schema;

schema.initOptionsSchema = function () {
  return {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "app_key": {
        "type": "string"
      },
      "client_secret": {
        "type": "string"
      },
      "client_id": {
        "type": "string"
      },
      "org_name": {
        "type": "string"
      },
      "app_name": {
        "type": "string"
      },
      "redis": {
        "type": "object",
        "properties": {
          "host": {
            "type": "string"
          },
          "port": {
            "type": "integer"
          },
          "auth": {
            "type": "string"
          }
        },
        "required": [
          "host",
          "port"
        ]
      }
    },
    "required": [
      "client_secret",
      "client_id",
      "org_name",
      "app_name",
      "redis"
    ]
  };
};