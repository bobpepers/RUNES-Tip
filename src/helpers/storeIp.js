import db from '../models';

function upsert(values) {
  return db.IpUser
    .findOne({ where: values })
    .then((obj) => {
      // update
      if (obj) {
        console.log('update IpUserModel');
        obj.changed('updatedAt', true);
        return obj.save();
      }
      return db.IpUser.create(values);
    });
}

const storeIP = async (req, res, next) => {
  let storedIP;
  const ip = req.headers['cf-connecting-ip']
     || req.headers['x-forwarded-for']
     || req.connection.remoteAddress
     || req.socket.remoteAddress
     || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log(ip);

  storedIP = await db.ip.findOne({
    where: {
      address: ip,
    },
  });
  if (!storedIP) {
    storedIP = await db.ip.create({ address: ip });
  }
  await upsert({
    userId: req.user.id,
    ipId: storedIP.id,
  });

  res.locals.ip = ip;
  res.locals.ipId = storedIP.id;
  next();
};

export default storeIP;
