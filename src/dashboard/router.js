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
import { healthCheck } from './controllers/health';
import {
  fetchBotSettings,
  updateBotSettings,
} from './controllers/bots';

import { insertIp } from './controllers/ip';

import {
  fetchServers,
  banServer,
  leaveServer,
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
  keepSessionInfo: true,
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
  telegramApiClient,
  matrixClient,
) => {
  const attachResLocalsClients = (req, res, next) => {
    res.locals.discordClient = discordClient;
    res.locals.telegramClient = telegramClient;
    res.locals.telegramApiClient = telegramApiClient;
    res.locals.matrixClient = matrixClient;
    next();
  };

  app.get(
    '/api/health',
    use(healthCheck),
    respondResult,
  );

  app.get(
    '/api/authenticated',
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.json({
          result: {
            tfaLocked: false,
            success: false,
          },
        });
      }
    },
    istfa,
  );

  app.post(
    '/api/signup',
    use(verifyMyCaptcha),
    use(use(insertIp)),
    use(signup),
  );

  app.post(
    '/api/functions/withdrawal/accept',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(ensuretfa),
    use(insertIp),
    attachResLocalsClients,
    use(acceptWithdrawal),
    respondResult,
  );

  app.post(
    '/api/functions/withdrawal/decline',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(ensuretfa),
    use(insertIp),
    attachResLocalsClients,
    use(declineWithdrawal),
    respondResult,
  );

  app.post(
    '/api/management/user/ban',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(banUser),
    respondResult,
  );

  app.post(
    '/api/management/channel/ban',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(banChannel),
    respondResult,
  );

  app.post(
    '/api/management/server/ban',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(banServer),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchPriceCurrencies),
    respondCountAndResult,
  );

  app.post(
    '/api/management/pricecurrencies/remove',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(removePriceCurrency),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies/update',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(updatePriceCurrency),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies/add',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(addPriceCurrency),
    respondResult,
  );

  app.post(
    '/api/management/pricecurrencies/updateprice',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(updatePriceCurrencyPrices),
    respondResult,
  );

  app.post(
    '/api/management/feature/remove',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(removeFeature),
    respondResult,
  );

  app.post(
    '/api/management/feature/update',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(updateFeature),
    respondResult,
  );

  app.post(
    '/api/management/feature/add',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(addFeature),
    respondResult,
  );

  app.post(
    '/api/management/features',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchFeatures),
    respondCountAndResult,
  );

  app.post(
    '/api/management/bot/settings/update',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(updateBotSettings),
    respondResult,
  );

  app.post(
    '/api/management/bot/settings',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchBotSettings),
    respondCountAndResult,
  );

  app.post(
    '/api/management/channels',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchChannels),
    respondCountAndResult,
  );

  app.get(
    '/api/management/triviaquestions',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchTriviaQuestions),
    respondCountAndResult,
  );

  app.post(
    '/api/management/trivia/switch',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(switchTriviaQuestion),
    respondResult,
  );

  app.post(
    '/api/management/trivia/remove',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(removeTriviaQuestion),
    respondResult,
  );

  app.post(
    '/api/management/trivia/insert',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(insertTrivia),
    respondResult,
  );

  app.get(
    '/api/sync/blocks',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(startSyncBlocks),
    respondResult,
  );

  app.get(
    '/api/blocknumber',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchBlockNumber),
    respondResult,
  );

  app.post(
    '/api/activity',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchActivity),
    respondCountAndResult,
  );

  app.post(
    '/api/deposits/patch',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(patchDeposits),
    respondResult,
  );

  app.post(
    '/api/user',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchUser),
    respondResult,
  );

  app.post(
    '/api/management/users',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchUsers),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/withdrawals',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchWithdrawals),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/deposits',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchDeposits),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/rains',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchRains),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/rain',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchRain),
    respondResult,
  );

  app.post(
    '/api/functions/floods',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchFloods),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/flood',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchFlood),
    respondResult,
  );

  app.post(
    '/api/functions/sleets',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchSleets),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/sleet',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchSleet),
    respondResult,
  );

  app.post(
    '/api/functions/soaks',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchSoaks),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/soak',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchSoak),
    respondResult,
  );

  app.post(
    '/api/functions/thunders',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchThunders),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/thunder',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchThunder),
    respondResult,
  );

  app.post(
    '/api/functions/reactdrops',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchReactdrops),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/reactdrop',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchReactdrop),
    respondResult,
  );

  app.post(
    '/api/functions/tips',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchTips),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/tip',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchTip),
    respondResult,
  );

  app.post(
    '/api/functions/thunderstorms',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchThunderstorms),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/thunderstorm',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchThunderstorm),
    respondResult,
  );

  app.post(
    '/api/functions/hurricanes',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchHurricanes),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/hurricane',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchHurricane),
    respondResult,
  );

  app.post(
    '/api/functions/trivias',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchTrivias),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/trivia',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchTrivia),
    respondResult,
  );

  app.post(
    '/api/functions/voicerains',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchVoicerains),
    respondCountAndResult,
  );

  app.post(
    '/api/functions/voicerain',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchVoicerain),
    respondResult,
  );

  app.post(
    '/api/functions/errors',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchErrors),
    respondCountAndResult,
  );

  app.post(
    '/api/management/withdrawaladdresses',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchWithdrawalAddresses),
    respondCountAndResult,
  );

  app.post(
    '/api/management/withdrawaladdress',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchWithdrawalAddress),
    respondResult,
  );

  app.post(
    '/api/management/userinfo',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchUserInfo),
    respondResult,
  );

  app.post(
    '/api/management/dashboardusers',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchDashboardUsers),
    respondCountAndResult,
  );

  app.post(
    '/api/management/servers',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    attachResLocalsClients,
    use(fetchServers),
    respondCountAndResult,
  );

  app.post(
    '/api/management/server/leave',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    attachResLocalsClients,
    use(leaveServer),
    respondResult,
  );

  app.get(
    '/api/status',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(fetchNodeStatus),
    respondResult,
  );

  app.get(
    '/api/balance',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(ensuretfa),
    use(fetchBalance),
    respondResult,
  );

  app.get(
    '/api/faucet/balance',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(ensuretfa),
    use(fetchFaucetBalance),
    respondResult,
  );

  app.get(
    '/api/liability',
    use(IsAuthenticated),
    use(isAdmin),
    use(isDashboardUserBanned),
    use(ensuretfa),
    use(fetchLiability),
    respondResult,
  );

  app.post(
    '/api/signup/verify-email',
    use(insertIp),
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
    // use(IsAuthenticated),
    use(insertIp),
    // rateLimiterMiddlewarePhone,
    // use(ensuretfa),
    // updateLastSeen,
    use(resendVerification),
  );

  app.post(
    '/api/signin',
    use(verifyMyCaptcha),
    use(insertIp),
    use(requireSignin),
    use(isDashboardUserBanned),
    use(signin),
    respondResult,
  );

  app.post(
    '/api/reset-password',
    use(verifyMyCaptcha),
    use(resetPassword),
    respondResult,
  );

  app.post(
    '/api/reset-password/verify',
    use(verifyResetPassword),
    respondResult,
  );

  app.post(
    '/api/reset-password/new',
    use(resetPasswordNew),
    respondResult,
  );

  app.post(
    '/api/2fa/enable',
    use(IsAuthenticated),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    // updateLastSeen,
    use(enabletfa),
    respondResult,
  );

  app.post(
    '/api/2fa/disable',
    use(IsAuthenticated),
    use(isDashboardUserBanned),
    use(insertIp),
    use(ensuretfa),
    use(disabletfa),
    respondResult,
  );

  app.post(
    '/api/2fa/unlock',
    use(IsAuthenticated),
    use(isDashboardUserBanned),
    use(insertIp),
    use(unlocktfa),
    respondResult,
  );

  app.get(
    '/api/logout',
    use(insertIp),
    use(destroySession),
  );
};
