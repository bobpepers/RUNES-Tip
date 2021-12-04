/* eslint-disable import/prefer-default-export */
import db from '../../models';
import {
    invalidAmountMessage,
    insufficientBalanceMessage,
    walletNotFoundMessage,
    minimumMessage,
    AfterHurricaneSuccess,
    hurricaneMaxUserAmountMessage,
    hurricaneInvalidUserAmount,
    hurricaneUserZeroAmountMessage,
    NotInDirectMessage,
} from '../../messages/discord';

import _ from "lodash";

import BigNumber from "bignumber.js";
import { Transaction, Op } from "sequelize";
import logger from "../../helpers/logger";

export const discordHurricane = async (
    discordClient,
    message,
    filteredMessage,
    io,
    groupTask,
    channelTask,
    setting,
) => {
    if (!groupTask || !channelTask) {
        await message.channel.send({ embeds: [NotInDirectMessage(message, 'Flood')] });
        return;
    }
    if (Number(filteredMessage[2]) > 50) {
        await message.channel.send({ embeds: [hurricaneMaxUserAmountMessage(message)] });
        return;
    }
    if (Number(filteredMessage[2]) % 1 !== 0) {
        await message.channel.send({ embeds: [hurricaneInvalidUserAmount(message)] });
        return;
    }
    if (Number(filteredMessage[2]) <= 0) {
        await message.channel.send({ embeds: [hurricaneUserZeroAmountMessage(message)] });
        return;
    }
    const members = await discordClient.guilds.cache.get(message.guildId).members.fetch({ withPresences: true });
    const onlineMembers = members.filter((member) =>
        member.presence?.status === "online"
        || member.presence?.status === "idle"
        || member.presence?.status === "dnd"
    );
    const mappedMembersArray = onlineMembers.map((a) => {
        return a.user;
    });
    const preWithoutBots = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const discordUser of mappedMembersArray) {
        // eslint-disable-next-line no-await-in-loop
        if (discordUser.bot === false) {
            // eslint-disable-next-line no-await-in-loop
            const userExist = await db.user.findOne({
                where: {
                    user_id: `discord-${discordUser.id}`,
                },
                include: [
                    {
                        model: db.wallet,
                        as: 'wallet',
                        required: true,
                        include: [
                            {
                                model: db.address,
                                as: 'addresses',
                                required: true,
                            },
                        ],
                    },
                ],
            });
            if (userExist) {
                const userIdTest = userExist.user_id.replace('discord-', '');
                if (userIdTest !== message.author.id) {
                    preWithoutBots.push(userExist);
                }
            }
        }
    }
    const withoutBots = _.sampleSize(preWithoutBots, Number(filteredMessage[2]));
    let activity;
    let user;
    await db.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    }, async (t) => {
        user = await db.user.findOne({
            where: {
                user_id: `discord-${message.author.id}`,
            },
            include: [
                {
                    model: db.wallet,
                    as: 'wallet',
                    required: true,
                    include: [
                        {
                            model: db.address,
                            as: 'addresses',
                            required: true,
                        },
                    ],
                },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,
        });
        if (!user) {
            activity = await db.activity.create({
                type: 'hurricane_f',
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            await message.channel.send({ embeds: [walletNotFoundMessage(message, 'Hurricane')] });
            return;
        }
        let amount = 0;
        if (filteredMessage[3].toLowerCase() === 'all') {
            amount = user.wallet.available;
        } else {
            amount = new BigNumber(filteredMessage[3]).times(1e8).toNumber();
        }
        if (amount < setting.min) {
            activity = await db.activity.create({
                type: 'hurricane_f',
                spenderId: user.id,
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            await message.channel.send({ embeds: [minimumMessage(message, 'Hurricane')] });
            return;
        }
        if (amount % 1 !== 0) {
            activity = await db.activity.create({
                type: 'hurricane_f',
                spenderId: user.id,
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            await message.channel.send({ embeds: [invalidAmountMessage(message, 'Hurricane')] });
            return;
        }
        if (amount <= 0) {
            activity = await db.activity.create({
                type: 'hurricane_f',
                spenderId: user.id,
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            await message.channel.send({ embeds: [invalidAmountMessage(message, 'Hurricane')] });
            return;
        }

        if (user.wallet.available < amount) {
            activity = await db.activity.create({
                type: 'hurricane_i',
                spenderId: user.id,
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            await message.channel.send({ embeds: [insufficientBalanceMessage(message, 'Hurricane')] });
            return;
        }
        if (withoutBots.length < 1) {
            activity = await db.activity.create({
                type: 'hurricane_f',
                spenderId: user.id,
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            await message.channel.send('Not enough online users');
            return;
        }

        const updatedBalance = await user.wallet.update({
            available: user.wallet.available - amount,
        }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
        });

        const amountPerUser = (((amount / withoutBots.length).toFixed(0)));
        const hurricaneRecord = await db.hurricane.create({
            amount,
            userCount: withoutBots.length,
            userId: user.id,
            groupId: groupTask.id,
            channelId: channelTask.id,
        }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
        });
        activity = await db.activity.create({
            amount,
            type: 'hurricane_s',
            spenderId: user.id,
            hurricaneId: hurricaneRecord.id,
            spender_balance: updatedBalance.available + updatedBalance.locked,
        }, {
            lock: t.LOCK.UPDATE,
            transaction: t,
        });
        activity = await db.activity.findOne({
            where: {
                id: activity.id,
            },
            include: [
                {
                    model: db.hurricane,
                    as: 'hurricane'
                },
                {
                    model: db.user,
                    as: 'spender'
                },
            ],
            lock: t.LOCK.UPDATE,
            transaction: t,

        });
        const listOfUsersRained = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const hurricaneee of withoutBots) {
            // eslint-disable-next-line no-await-in-loop
            const hurricaneeeWallet = await hurricaneee.wallet.update({
                available: hurricaneee.wallet.available + Number(amountPerUser),
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            // eslint-disable-next-line no-await-in-loop
            console.log(amountPerUser);
            console.log(hurricaneee.id);
            console.log(hurricaneRecord.id);

            const hurricanetipRecord = await db.hurricanetip.create({
                amount: amountPerUser,
                userId: hurricaneee.id,
                hurricaneId: hurricaneRecord.id,
                groupId: groupTask.id,
                channelId: channelTask.id,
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });

            if (hurricaneee.ignoreMe) {
                listOfUsersRained.push(`${hurricaneee.username}`);
            } else {
                const userIdReceivedRain = hurricaneee.user_id.replace('discord-', '');
                listOfUsersRained.push(`<@${userIdReceivedRain}>`);;
            }
            let tipActivity;
            tipActivity = await db.activity.create({
                amount: Number(amountPerUser),
                type: 'hurricanetip_s',
                spenderId: user.id,
                earnerId: hurricaneee.id,
                hurricaneId: hurricaneRecord.id,
                hurricanetipId: hurricanetipRecord.id,
                earner_balance: hurricaneeeWallet.available + hurricaneeeWallet.locked,
                spender_balance: updatedBalance.available + updatedBalance.locked,
            }, {
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            tipActivity = await db.activity.findOne({
                where: {
                    id: tipActivity.id,
                },
                include: [
                    {
                        model: db.user,
                        as: 'earner'
                    },
                    {
                        model: db.user,
                        as: 'spender'
                    },
                    {
                        model: db.hurricane,
                        as: 'hurricane'
                    },
                    {
                        model: db.hurricanetip,
                        as: 'hurricanetip'
                    },
                ],
                lock: t.LOCK.UPDATE,
                transaction: t,
            });
            console.log(tipActivity);
            io.to('admin').emit('updateActivity', {
                activity: tipActivity,
            });
        }
        await message.channel.send({ embeds: [AfterHurricaneSuccess(message, amount, amountPerUser, listOfUsersRained)] });

        logger.info(`Success Hurricane Requested by: ${message.author.id}-${message.author.username} for ${amount / 1e8}`);

        t.afterCommit(() => {
            console.log('done');
        });
    }).catch((err) => {
        message.channel.send('something went wrong');
    });
    io.to('admin').emit('updateActivity', {
        activity,
    });
};
