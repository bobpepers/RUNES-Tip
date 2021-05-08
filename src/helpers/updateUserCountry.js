import db from '../models';

const getCountryISO3 = require("country-iso-2-to-3");
const geoip = require('geoip-lite');

const updateUserCountry = async (req, res, next) => {
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');
  console.log('11111111111111111111111111111111111111111111');

  try {
    let storedIP;
    const ip = req.headers['cf-connecting-ip']
           || req.headers['x-forwarded-for']
           || req.connection.remoteAddress
           || req.socket.remoteAddress
           || (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.log(ip);
    const geo = geoip.lookup(ip);
    console.log('21111111111111111111111111111111111111111111');
    console.log(geo);
    if (geo) {
      console.log('31111111111111111111111111111111111111111111');
      const isotree = getCountryISO3(geo.country);
      console.log('41111111111111111111111111111111111111111111');
      console.log(isotree);
      if (isotree) {
        console.log('51111111111111111111111111111111111111111111');
        const country = await db.country.findOne({
          where: {
            iso: isotree,
          },
        });
        console.log(country);
        console.log(req.user.id);
        await db.user.update(
          {
            countryId: country.id,
          },
          {
            where: {
              id: req.user.id,
            },
          },
        );
      }
    }
  } catch (error) {
    console.log(error);
    // execution continues here when an error was thrown. You can also inspect the `ex`ception object
  }

  next();
};

export default updateUserCountry;
