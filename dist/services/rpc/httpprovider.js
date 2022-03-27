"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var url = require('url');

var axios = require('axios');

var _require = require('lodash'),
    isEmpty = _require.isEmpty;
/**
 * HTTP Provider for interacting with the blockchain via JSONRPC POST calls.
 */


var HttpProvider = /*#__PURE__*/function () {
  /**
   * Constructor.
   * @param {string} urlString URL of the blockchain access point. eg. http://pirate:pirate@127.0.0.1:13889
   */
  function HttpProvider(urlString) {
    (0, _classCallCheck2["default"])(this, HttpProvider);
    this.url = url.parse(urlString);
  }
  /**
   * Executes a request to the blockchain via JSONRPC POST request.
   * @param {string} method Blockchain method to call. eg. 'getwalletinfo'
   * @param {array} args Raw arguments for the call. ["arg1", "arg2"]
   */


  (0, _createClass2["default"])(HttpProvider, [{
    key: "rawCall",
    value: function () {
      var _rawCall = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(method) {
        var args,
            body,
            _yield$axios$data,
            result,
            error,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                args = _args.length > 1 && _args[1] !== undefined ? _args[1] : [];

                if (!isEmpty(method)) {
                  _context.next = 3;
                  break;
                }

                throw Error('method cannot be empty.');

              case 3:
                // Construct body
                body = {
                  id: new Date().getTime(),
                  jsonrpc: '1.0',
                  method: method,
                  params: args
                }; // Execute POST request

                _context.next = 6;
                return axios({
                  method: 'post',
                  url: "".concat(this.url.protocol, "//").concat(this.url.host),
                  headers: {
                    'Content-Type': 'text/plain',
                    Authorization: "Basic ".concat(Buffer.from(this.url.auth).toString('base64'))
                  },
                  data: JSON.stringify(body)
                });

              case 6:
                _yield$axios$data = _context.sent.data;
                result = _yield$axios$data.result;
                error = _yield$axios$data.error;

                if (!error) {
                  _context.next = 11;
                  break;
                }

                throw Error(error);

              case 11:
                return _context.abrupt("return", result);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function rawCall(_x) {
        return _rawCall.apply(this, arguments);
      }

      return rawCall;
    }()
  }]);
  return HttpProvider;
}();

module.exports = HttpProvider;