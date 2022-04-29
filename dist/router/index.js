"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _discord = require("./discord");

var _telegram = require("./telegram");

var _matrix = require("./matrix");

var _notify = require("./notify");

var router = function router(app, discordClient, telegramClient, matrixClient, io, settings, queue) {
  (0, _notify.notifyRouter)(app, discordClient, telegramClient, matrixClient, io, settings, queue);

  if (settings.bot.enabled.discord) {
    (0, _discord.discordRouter)(discordClient, queue, io, settings);
  }

  if (settings.bot.enabled.telegram) {
    (0, _telegram.telegramRouter)(telegramClient, queue, io, settings);
  }

  if (settings.bot.enabled.matrix) {
    (0, _matrix.matrixRouter)(matrixClient, queue, io, settings);
  }
};

exports.router = router;