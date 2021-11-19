const { getInstance } = require('../../services/rclient');

export const fetchBalance = async (req, res, next) => {
  try {
    const response = await getInstance().getWalletInfo();
    console.log(response);
    res.locals.balance = response.balance;
    // console.log(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
