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
  console.log(ctx.update.message.from);
  const userId = ctx.update.message.from.id;
  let userToMention;
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
  return [
    userToMention,
    userId,
  ];
};
