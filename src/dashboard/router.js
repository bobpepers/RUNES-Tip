import passport from 'passport';
import {
  signin,
  signup,
  verifyEmail,
  resendVerification,
  destroySession,
  isDashboardUserBanned,
} from './controllers/auth';

import { isAdmin } from './controllers/admin';
import { fetchUserInfo } from './controllers/userInfo';
import { fetchFaucetBalance } from './controllers/faucet';
import { fetchLiability } from './controllers/liability';
import { fetchBalance } from './controllers/balance';
import {
  fetchBotSettings,
  updateBotSettings,
} from './controllers/bots';

import { insertIp } from './controllers/ip';

import {
  fetchServers,
  banServer,
} from './controllers/servers';

import {
  fetchErrors,
} from './controllers/errors';

import { fetchNodeStatus } from './controllers/status';

import {
  fetchWithdrawals,
  acceptWithdrawal,
  declineWithdrawal,
} from './controllers/withdrawals';

import {
  fetchWithdrawalAddress,
  fetchWithdrawalAddresses,
} from './controllers/withdrawalAddresses';
import { fetchActivity } from './controllers/activity';
import {
  fetchFeatures,
  addFeature,
  removeFeature,
  updateFeature,
} from './controllers/features';

import {
  fetchPriceCurrencies,
  addPriceCurrency,
  removePriceCurrency,
  updatePriceCurrency,
  updatePriceCurrencyPrices,
} from './controllers/priceCurrencies';

import {
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';

import { verifyMyCaptcha } from './controllers/recaptcha';

import {
  insertTrivia,
  removeTriviaQuestion,
  fetchTriviaQuestions,
  switchTriviaQuestion,
  fetchTrivia,
  fetchTrivias,
} from './controllers/trivia';

import {
  fetchDashboardUsers,
} from './controllers/dashboardUsers';

import {
  fetchDeposits,
  patchDeposits,
} from './controllers/deposits';

import {
  fetchChannels,
  banChannel,
} from './controllers/channels';

import {
  fetchBlockNumber,
} from './controllers/blockNumber';

import {
  startSyncBlocks,
} from './controllers/sync';

import {
  fetchUsers,
  banUser,
} from './controllers/users';
import passportService from './services/passport';
import {
  disabletfa,
  enabletfa,
  ensuretfa,
  unlocktfa,
  istfa,
} from './controllers/tfa';

import {
  fetchUser,
} from './controllers/user';

import {
  fetchRain,
  fetchRains,
} from './controllers/rain';

import {
  fetchSoak,
  fetchSoaks,
} from './controllers/soak';

import {
  fetchFlood,
  fetchFloods,
} from './controllers/flood';

import {
  fetchThunder,
  fetchThunders,
} from './controllers/thunder';

import {
  fetchThunderstorm,
  fetchThunderstorms,
} from './controllers/thunderstorm';

import {
  fetchSleet,
  fetchSleets,
} from './controllers/sleet';

import {
  fetchVoicerain,
  fetchVoicerains,
} from './controllers/voicerain';

import {
  fetchHurricane,
  fetchHurricanes,
} from './controllers/hurricane';

import {
  fetchReactdrop,
  fetchReactdrops,
} from './controllers/reactdrop';

import {
  fetchTip,
  fetchTips,
} from './controllers/tip';

// import storeIp from './helpers/storeIp';

const requireSignin = passport.authenticate('local', {
  session: true,
  failWithError: true,
});

const IsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('isauthenticated passed');
    next();
  } else {
    console.log('isAuthenticated not passed');
    res.status(401).send({
      error: 'Unauthorized',
    });
  }
};

const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const respondCountAndResult = (req, res) => {
  if (
    res.locals.count
    && res.locals.result
    && res.locals.result.length > 0
  ) {
    res.json({
      count: res.locals.count,
      result: res.locals.result,
    });
  } else if (
    res.locals.result.length < 1
  ) {
    res.status(404).send({
      error: `No ${res.locals.name} records found`,
    });
  } else {
    res.status(401).send({
      error: "ERROR",
    });
  }
};

const respondResult = (req, res) => {
  console.log(res.locals.result);
  console.log(res.locals.result.length);
  if (
    res.locals.result
    && res.locals.result.length > 0
  ) {
    res.json({
      result: res.locals.result,
    });
  } else if (
    typeof res.locals.result === 'object'
    && Object.keys(res.locals.result).length > 0
    && res.locals.result !== null
  ) {
    res.json({
      result: res.locals.result,
    });
  } else if (
    res.locals.result.length < 1
  ) {
    res.status(404).send({
      error: `No ${res.locals.name} records found`,
    });
  } else {
    res.status(401).send({
      error: "ERROR",
    });
  }
};

export const dashboardRouter = (
  app,
  io,
  discordClient,
  telegramClient,
  matrixClient,
) => {
  const attachResLocalsClients = (req, res, next) => {
    res.locals.discordClient = discordClient;
    res.locals.telegramClient = telegramClient;
    res.locals.matrixClient = matrixClient;
    next();
  };

  app.get(
    '/api/authenticated',
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.json({ success: false });
      }
    },
    istfa,
  );

  app.post(
    '/api/signup',
    verifyMyCaptcha,
    insertIp,
    signup,
  );

  app.post(
    '/api/functions/withdrawal/accept',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    insertIp,
    attachResLocalsClients,
    acceptWithdrawal,
    respondResult,
  );

  app.post(
    '/api/functions/withdrawal/decline',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    insertIp,
    attachResLocalsClients,
    declineWithdrawal,
    respondResult,
  );

  app.post(
    '/api/management/user/ban',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(banUser),
    respondResult,
  );

  app.post(
    '/api/management/channel/ban',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(banChannel),
    respondResult,
  );

  app.post(
    '/api/management/server/ban',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(banServer),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchPriceCurrencies),
    respondCountAndResult,
  );

  app.post(
    '/api/management/pricecurrencies/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(removePriceCurrency),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(updatePriceCurrency),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies/add',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(addPriceCurrency),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies/updateprice',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(updatePriceCurrencyPrices),
    respondResult,
  );

  app.post(
    '/api/management/feature/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(removeFeature),
    respondResult,
  );

  app.post(
    '/api/management/feature/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(updateFeature),
    respondResult,
  );

  app.post(
    '/api/management/feature/add',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(addFeature),
    respondResult,
  );

  app.post(
    '/api/management/features',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchFeatures),
    respondCountAndResult,
  );

  app.post(
    '/api/management/bot/settings/update',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(updateBotSettings),
    respondResult,
  );

  app.post(
    '/api/management/bot/settings',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchBotSettings),
    respondCountAndResult,
  );

  app.post(
    '/api/management/channels',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchChannels),
    respondCountAndResult,
  );

  app.get(
    '/api/management/triviaquestions',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchTriviaQuestions),
    respondCountAndResult,
  );

  app.post(
    '/api/management/trivia/switch',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(switchTriviaQuestion),
    respondResult,
  );

  app.post(
    '/api/management/trivia/remove',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(removeTriviaQuestion),
    respondResult,
  );

  app.post(
    '/api/management/trivia/insert',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(insertTrivia),
    respondResult,
  );

  app.get(
    '/api/sync/blocks',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(startSyncBlocks),
    respondResult,
  );

  app.get(
    '/api/blocknumber',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchBlockNumber),
    respondResult,
  );

  app.post(
    '/api/activity',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchActivity),
    respondCountAndResult,
  );

  app.post(
    '/api/deposits/patch',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(patchDeposits),
    respondResult,
  );

  app.get(
    '/api/user',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchUser),
    respondResult,
  );

  app.post(
    '/api/management/users',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchUsers),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/withdrawals',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawals),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/deposits',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchDeposits),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/rains',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchRains),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/rain',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchRain),
    respondResult,
  );

  app.post(
    '/api/functions/floods',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchFloods),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/flood',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchFlood),
    respondResult,
  );

  app.post(
    '/api/functions/sleets',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchSleets),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/sleet',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchSleet),
    respondResult,
  );

  app.post(
    '/api/functions/soaks',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchSoaks),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/soak',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchSoak),
    respondResult,
  );

  app.post(
    '/api/functions/thunders',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchThunders),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/thunder',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchThunder),
    respondResult,
  );

  app.post(
    '/api/functions/reactdrops',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchReactdrops),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/reactdrop',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchReactdrop),
    respondResult,
  );

  app.post(
    '/api/functions/tips',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchTips),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/tip',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchTip),
    respondResult,
  );

  app.post(
    '/api/functions/thunderstorms',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchThunderstorms),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/thunderstorm',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchThunderstorm),
    respondResult,
  );

  app.post(
    '/api/functions/hurricanes',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchHurricanes),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/hurricane',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchHurricane),
    respondResult,
  );

  app.post(
    '/api/functions/trivias',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchTrivias),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/trivia',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchTrivia),
    respondResult,
  );

  app.post(
    '/api/functions/voicerains',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchVoicerains),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/voicerain',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchVoicerain),
    respondResult,
  );

  app.post(
    '/api/functions/errors',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchErrors),
    respondCountAndResult,
  );

  app.post(
    '/api/management/withdrawaladdresses',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawalAddresses),
    respondCountAndResult,
  );

  app.post(
    '/api/management/withdrawaladdress',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchWithdrawalAddress),
    respondResult,
  );

  app.post(
    '/api/management/dashboardusers',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchDashboardUsers),
    respondCountAndResult,
  );

  app.post(
    '/api/management/servers',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchServers),
    respondCountAndResult,
  );

  app.post(
    '/api/management/userinfo',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchUserInfo),
    respondResult,
  );

  app.get(
    '/api/status',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    insertIp,
    ensuretfa,
    use(fetchNodeStatus),
    respondResult,
  );

  app.get(
    '/api/balance',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    use(fetchBalance),
    respondResult,
  );

  app.get(
    '/api/faucet/balance',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    use(fetchFaucetBalance),
    respondResult,
  );

  app.get(
    '/api/liability',
    IsAuthenticated,
    isAdmin,
    isDashboardUserBanned,
    ensuretfa,
    use(fetchLiability),
    respondResult,
  );

  app.post(
    '/api/signup/verify-email',
    insertIp,
    use(verifyEmail),
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error === 'AUTH_TOKEN_EXPIRED') {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: true,
          },
        });
      }
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.user) {
        res.json({
          firstname: res.locals.user.firstname,
          username: res.locals.user.username,
        });
      }
    },
  );

  app.post(
    '/api/resend-verify-code',
    // IsAuthenticated,
    insertIp,
    // rateLimiterMiddlewarePhone,
    // ensuretfa,
    // updateLastSeen,
    use(resendVerification),
  );

  app.post(
    '/api/signin',
    verifyMyCaptcha,
    // insertIp,
    requireSignin,
    isDashboardUserBanned,
    use(signin),
    (err, req, res, next) => {
      if (req.authErr === 'EMAIL_NOT_VERIFIED') {
        console.log('EMAIL_NOT_VERIFIED');
        req.session.destroy();
        res.status(401).send({
          error: req.authErr,
          email: res.locals.email,
        });
      } else if (req.authErr) {
        console.log(req.authErr);
        console.log('LOGIN_ERROR');
        req.session.destroy();
        res.status(401).send({
          error: 'LOGIN_ERROR',
        });
      } else {
        res.json({
          username: req.user.username,
        });
      }
    },
  );

  app.post(
    '/api/reset-password',
    verifyMyCaptcha,
    use(resetPassword),
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.resetPassword) {
        res.json({
          success: true,
        });
      }
    },
  );

  app.post(
    '/api/reset-password/verify',
    use(verifyResetPassword),
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.resetPasswordVerify) {
        res.json({
          success: true,
        });
      }
    },
  );

  app.post(
    '/api/reset-password/new',
    use(resetPasswordNew),
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.email && res.locals.username) {
        res.json({
          username: res.locals.username,
          email: res.locals.email,
        });
      }
    },
  );

  app.post(
    '/api/2fa/enable',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    use(enabletfa),
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.tfa) {
        res.json({
          data: res.locals.tfa,
        });
      }
    },
  );

  app.post(
    '/api/2fa/disable',
    IsAuthenticated,
    // storeIp,
    ensuretfa,
    // updateLastSeen,
    use(disabletfa),
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.success) {
        res.json({
          data: res.locals.tfa,
        });
      }
    },
  );

  app.post(
    '/api/2fa/unlock',
    IsAuthenticated,
    isDashboardUserBanned,
    // storeIp,
    use(unlocktfa),
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.success) {
        res.json({
          success: true,
          tfaLocked: false,
        });
      }
    },
  );

  app.get(
    '/api/logout',
    insertIp,
    // storeIp,
    use(destroySession),
    (req, res) => {
      res.redirect("/");
    },
  );
};
