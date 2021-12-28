"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _discord = require("./discord");

var _telegram = require("./telegram");

var _notify = require("./notify");

var router = function router(app, discordClient, telegramClient, io, settings, queue) {
  (0, _notify.notifyRouter)(app, discordClient, telegramClient, settings);
  (0, _discord.discordRouter)(discordClient, queue, io, settings);
  (0, _telegram.telegramRouter)(telegramClient, queue, io, settings);
};

exports.router = router;