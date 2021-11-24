"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = require("lodash");

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _sequelize = require("sequelize");

var _models = _interopRequireDefault(require("../models"));

var _logger = _interopRequireDefault(require("./logger"));

function sortObject(obj) {
  var arr = [];

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        key: prop,
        value: obj[prop]
      });
    }
  }

  arr.sort(function (a, b) {
    return a.value - b.value;
  }); // arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings

  return arr; // returns array
}

var drawReferralContest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(sub, pub, expired_subKey) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].sequelize.transaction({
              isolationLevel: _sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(t) {
                var rewards, contestRewards, constestReferral, startsAt, endsAt, endsAtUnix, nowUnix, newEndDate, cronjob, userArray, winnerArray, referrals, result, i, sorted, revSorted, updatedReferralContest, newRewards, newReferralContest, scheduleNextDraw;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _models["default"].contestRewards.findAll({
                          limit: 1,
                          order: [['id', 'DESC']]
                        });

                      case 2:
                        rewards = _context.sent;
                        console.log(rewards);

                        if (!(!rewards || !rewards.length)) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 7;
                        return _models["default"].contestRewards.create({
                          firstPlace: '173 USD',
                          secondPlace: '2000 RUNES',
                          thirdPlace: '1000 RUNES',
                          firstPlaceNext: '25 USD',
                          secondPlaceNext: '1000 RUNES',
                          thirdPlaceNext: '500 RUNES'
                        });

                      case 7:
                        _context.next = 9;
                        return _models["default"].contestRewards.findAll({
                          limit: 1,
                          order: [['id', 'DESC']]
                        });

                      case 9:
                        contestRewards = _context.sent;
                        _context.next = 12;
                        return _models["default"].referralContest.findOne({
                          order: [['id', 'DESC']],
                          // where: {
                          //  phase: 'running',
                          // },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 12:
                        constestReferral = _context.sent;

                        _logger["default"].info(constestReferral);

                        _logger["default"].info('Find Jackpot'); // console.log(jackpot);


                        if (constestReferral) {
                          _context.next = 36;
                          break;
                        }

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        _logger["default"].info('Jackpot Not found');

                        startsAt = new Date('2021-04-18 17:00:00');
                        endsAt = new Date(new Date(startsAt).valueOf() + 7 * 24 * 60 * 60 * 1000);
                        _context.next = 36;
                        return _models["default"].referralContest.create({
                          startsAt: startsAt,
                          endsAt: endsAt
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 36:
                        if (!constestReferral) {
                          _context.next = 150;
                          break;
                        }

                        endsAtUnix = new Date(constestReferral.endsAt).valueOf();
                        nowUnix = new Date().valueOf();
                        newEndDate = new Date(new Date(constestReferral.endsAt).valueOf() + 7 * 24 * 60 * 60 * 1000); // (7 * 24 * 60 * 60 * 1000)
                        // const newEndDate = new Date(new Date(jackpot.endsAt).valueOf() + (5 * 60 * 1000)); // (7 * 24 * 60 * 60 * 1000)

                        _context.next = 42;
                        return _models["default"].cronjob.findOne({
                          order: [['createdAt', 'DESC']],
                          where: {
                            type: 'drawJackpot',
                            state: 'executing'
                          },
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 42:
                        cronjob = _context.sent;

                        if (cronjob) {
                          _context.next = 49;
                          break;
                        }

                        console.log(newEndDate.toISOString());
                        console.log('cronjob not found');
                        _context.next = 48;
                        return _models["default"].cronjob.create({
                          type: 'drawJackpot',
                          state: 'executing',
                          expression: newEndDate.toISOString()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 48:
                        console.log('cronjob created');

                      case 49:
                        if (!(endsAtUnix < nowUnix)) {
                          _context.next = 149;
                          break;
                        }

                        userArray = [];
                        winnerArray = [];
                        _context.next = 54;
                        return _models["default"].Referrals.findAll({
                          where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                            createdAt: (0, _defineProperty2["default"])({}, _sequelize.Op.gte, new Date(constestReferral.startsAt))
                          }, {
                            createdAt: (0, _defineProperty2["default"])({}, _sequelize.Op.lte, new Date(constestReferral.endsAt))
                          }]),
                          include: [{
                            model: _models["default"].user,
                            // required: false,
                            as: 'userReferred',
                            attributes: ['id', 'username', 'firstTrade', 'authused', 'identityVerified'],
                            where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                              firstTrade: (0, _defineProperty2["default"])({}, _sequelize.Op.ne, null)
                            }, {
                              authused: true
                            }, {
                              phoneNumberVerified: true
                            }, {
                              identityVerified: 'accepted'
                            }])
                          }, {
                            model: _models["default"].user,
                            // required: false,
                            as: 'userReferrer',
                            attributes: ['id', 'username', 'firstTrade', 'authused', 'identityVerified'],
                            where: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [{
                              firstTrade: (0, _defineProperty2["default"])({}, _sequelize.Op.ne, null)
                            }, {
                              authused: true
                            }, {
                              phoneNumberVerified: true
                            }, {
                              identityVerified: 'accepted'
                            }]),
                            include: [{
                              model: _models["default"].wallet,
                              // required: false,
                              as: 'wallet',
                              attributes: ['available', 'locked'],
                              where: {
                                available: (0, _defineProperty2["default"])({}, _sequelize.Op.gte, 20000000000)
                              }
                            }]
                          }],
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 54:
                        referrals = _context.sent;
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log('referrals');
                        console.log(referrals);
                        result = [];

                        for (i = 0; i < referrals.length; ++i) {
                          // loop over array
                          if (!result[referrals[i].userReferred.id]) {
                            // if no key for that number yet
                            result[referrals[i].userReferred.id] = 0; // then make one
                          }

                          ++result[referrals[i].userReferred.id]; // increment the property for that number

                          // increment the property for that number
                          console.log(result);
                        } //
                        // const entries = Object.entries(result);
                        // const sorted = entries.sort((a, b) => a[1] - b[1]);


                        //
                        // const entries = Object.entries(result);
                        // const sorted = entries.sort((a, b) => a[1] - b[1]);
                        sorted = sortObject(result);
                        revSorted = sorted.reverse();
                        console.log(revSorted);
                        console.log(revSorted[0]);
                        console.log(revSorted[1]);
                        console.log(revSorted[2]);
                        updatedReferralContest = constestReferral.update({
                          first_place_reward: contestRewards[0].firstPlace,
                          second_place_reward: contestRewards[0].secondPlace,
                          third_place_reward: contestRewards[0].thirdPlace,
                          winnerFirstId: revSorted[0] && revSorted[0].value >= 10 ? revSorted[0].key : null,
                          winnerSecondId: revSorted[1] && revSorted[1].value >= 10 ? revSorted[1].key : null,
                          winnerThirdId: revSorted[2] && revSorted[2].value >= 10 ? revSorted[2].key : null,
                          phase: 'complete'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });
                        _context.next = 130;
                        return _models["default"].contestRewards.create({
                          firstPlace: contestRewards[0].firstPlaceNext,
                          secondPlace: contestRewards[0].secondPlaceNext,
                          thirdPlace: contestRewards[0].thirdPlaceNext,
                          firstPlaceNext: contestRewards[0].firstPlaceNext,
                          secondPlaceNext: contestRewards[0].secondPlaceNext,
                          thirdPlaceNext: contestRewards[0].thirdPlaceNext
                        });

                      case 130:
                        newRewards = _context.sent;
                        _context.next = 133;
                        return _models["default"].referralContest.create({
                          startsAt: constestReferral.endsAt,
                          endsAt: newEndDate
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 133:
                        newReferralContest = _context.sent;

                        if (!cronjob) {
                          _context.next = 147;
                          break;
                        }

                        if (!(new Date(cronjob.expression).valueOf() > nowUnix + 5 * 60 * 1000)) {
                          _context.next = 140;
                          break;
                        }

                        _context.next = 138;
                        return cronjob.update({
                          state: 'error'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 138:
                        _context.next = 142;
                        break;

                      case 140:
                        _context.next = 142;
                        return cronjob.update({
                          state: 'finished'
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 142:
                        _context.next = 144;
                        return _models["default"].cronjob.create({
                          type: 'drawJackpot',
                          state: 'executing',
                          expression: newEndDate.toISOString()
                        }, {
                          transaction: t,
                          lock: t.LOCK.UPDATE
                        });

                      case 144:
                        console.log('before schedule next draw');
                        scheduleNextDraw = _nodeSchedule["default"].scheduleJob(newEndDate, function (fireDate) {
                          console.log("draw: This job was supposed to run at ".concat(fireDate, ", but actually ran at ").concat(new Date()));
                          drawReferralContest();
                        });

                        _logger["default"].info('subscribe');

                      case 147:
                        _context.next = 150;
                        break;

                      case 149:
                        console.log('have not reached date for draw');

                      case 150:
                        t.afterCommit(function () {
                          console.log('done');
                        });

                      case 151:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (err) {
              console.log(err);

              _logger["default"].info('Jackpot Error');

              _logger["default"].debug(err);
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function drawReferralContest(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = drawReferralContest;
exports["default"] = _default;