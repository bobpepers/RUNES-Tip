import db from '../models';

const fs = require('fs').promises;
const sharp = require('sharp');
const { Sequelize, Transaction, Op } = require('sequelize');

export const uploadAvatar = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let data;
    console.log(req.file.filename);
    console.log('req.file.filename');
    try {
      data = await fs.readFile(`${process.cwd()}/uploads/temp/${req.file.filename}`);
    } catch (err) {
      console.log('AVATAR_NOT_FOUND');
      console.log('AVATAR_NOT_FOUND');
      console.log('AVATAR_NOT_FOUND');
      console.log('AVATAR_NOT_FOUND');
      console.log('AVATAR_NOT_FOUND');
      console.log('AVATAR_NOT_FOUND');
      throw new Error('AVATAR_NOT_FOUND');
    }
    try {
      await sharp(data).resize(100, 100).toFile(`${process.cwd()}/uploads/avatars/${req.user.username}-${req.file.filename}`);
    } catch (err) {
      throw new Error('ERROR_RESIZE_IMAGE');
    }
    try {
      await fs.unlink(`${process.cwd()}/uploads/temp/${req.file.filename}`);
    } catch (err) {
      throw new Error('UNABLE_TO_REMOVE_TEMP');
    }
    console.log('USER FIND ONE ');
    console.log('USER FIND ONE ');
    console.log('USER FIND ONE ');
    console.log('USER FIND ONE ');
    console.log('USER FIND ONE ');
    console.log('USER FIND ONE ');

    const user = await db.user.findOne({
      where: {
        id: req.user.id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    if (user.avatar_path !== 'avatar.png') {
      try {
        await fs.unlink(`${process.cwd()}/uploads/avatars/${user.avatar_path}`);
      } catch (err) {
        console.log('FAILED_REMOVING_OLD_AVATAR');
        console.log('FAILED_REMOVING_OLD_AVATAR');
        console.log('FAILED_REMOVING_OLD_AVATAR');
        console.log('FAILED_REMOVING_OLD_AVATAR');
        console.log('FAILED_REMOVING_OLD_AVATAR');

        throw new Error('FAILED_REMOVING_OLD_AVATAR');
      }
    }
    const updatedUser = await user.update({
      avatar_path: `${req.user.username}-${req.file.filename}`,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    res.locals.avatar = updatedUser.avatar_path;
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

export const placeholder = async (req, res, next) => {
  console.log('upload avatar 3 ');
  next();
};
