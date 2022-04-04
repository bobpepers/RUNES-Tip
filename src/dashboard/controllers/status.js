import { getInstance } from '../../services/rclient';

export const fetchNodeStatus = async (
  req,
  res,
  next,
) => {
  const connected = await getInstance().isConnected();
  const peers = await getInstance().getPeerInfo();
  if (connected) {
    res.locals.status = connected;
  }
  if (peers) {
    res.locals.peers = peers;
  }
  next();
};
