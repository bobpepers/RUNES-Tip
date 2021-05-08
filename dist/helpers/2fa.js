'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var speakeasy = require('speakeasy');

var _require = require("../models"),
    UserModel = _require.UserModel;

var QRCode = require('qrcode');

var disable2fa = exports.disable2fa = function disable2fa() {};

var secret = exports.secret = function secret() {};