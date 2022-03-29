import db from "../../models";

export const createOrUseExternalWithdrawAddress = async (
  address,
  user,
  t,
) => {
  let addressExternal;
  let UserExternalAddressMnMAssociation;

  addressExternal = await db.addressExternal.findOne({
    where: {
      address,
    },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });

  if (!addressExternal) {
    addressExternal = await db.addressExternal.create({
      address,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
  }

  UserExternalAddressMnMAssociation = await db.UserAddressExternal.findOne({
    where: {
      addressExternalId: addressExternal.id,
      userId: user.id,
    },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });

  if (!UserExternalAddressMnMAssociation) {
    UserExternalAddressMnMAssociation = await db.UserAddressExternal.create({
      addressExternalId: addressExternal.id,
      userId: user.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
  }
  return addressExternal;
};
