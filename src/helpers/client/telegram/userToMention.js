export const getUserToMentionFromDatabaseRecord = async (
  user,
) => {
  const userId = user.user_id.replace('telegram-', '');
  let userToMention;
  if (user.username && user.username !== '') {
    userToMention = user.username;
  } else if (user.firstname && user.lastname && user.firstname !== '' && user.lastname !== '') {
    userToMention = `${user.firstname} ${user.lastname}`;
  } else if (user.firstname && user.firstname !== '') {
    userToMention = user.firstname;
  } else if (user.lastname && user.lastname !== '') {
    userToMention = user.lastname;
  } else {
    userToMention = 'unknownUser';
  }
  return [
    userToMention,
    userId,
  ];
};

export const getUserToMentionCtx = async (
  ctx,
) => {
  let userId;
  let userToMention;
  if (
    ctx
      && ctx.update
      && ctx.update.message
      && ctx.update.message.from
      && ctx.update.message.from.id
  ) {
    userId = ctx.update.message.from.id;
    if (
      ctx.update.message.from.username
      && ctx.update.message.from.username !== ''
    ) {
      userToMention = ctx.update.message.from.username;
    } else if (
      ctx.update.message.from.first_name
      && ctx.update.message.from.last_name
      && ctx.update.message.from.first_name !== ''
      && ctx.update.message.from.last_name !== ''
    ) {
      userToMention = `${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name}`;
    } else if (
      ctx.update.message.from.first_name
      && ctx.update.message.from.first_name !== ''
    ) {
      userToMention = ctx.update.message.from.first_name;
    } else if (
      ctx.update.message.from.last_name
      && ctx.update.message.from.last_name !== ''
    ) {
      userToMention = ctx.update.message.from.last_name;
    } else {
      userToMention = 'unknownUser';
    }
  } else if (
    ctx
      && ctx.update
      && ctx.update.callback_query
      && ctx.update.callback_query.from
      && ctx.update.callback_query.from.id
  ) {
    userId = ctx.update.callback_query.from.id;
    if (
      ctx.update.callback_query.from.username
      && ctx.update.callback_query.from.username !== ''
    ) {
      userToMention = ctx.update.callback_query.from.username;
    } else if (
      ctx.update.callback_query.from.first_name
      && ctx.update.callback_query.from.last_name
      && ctx.update.callback_query.from.first_name !== ''
      && ctx.update.callback_query.from.last_name !== ''
    ) {
      userToMention = `${ctx.update.callback_query.from.first_name} ${ctx.update.callback_query.from.last_name}`;
    } else if (
      ctx.update.callback_query.from.first_name
      && ctx.update.callback_query.from.first_name !== ''
    ) {
      userToMention = ctx.update.callback_query.from.first_name;
    } else if (
      ctx.update.callback_query.from.last_name
      && ctx.update.callback_query.from.last_name !== ''
    ) {
      userToMention = ctx.update.callback_query.from.last_name;
    } else {
      userToMention = 'unknownUser';
    }
  }

  return [
    userToMention,
    userId,
  ];
};
