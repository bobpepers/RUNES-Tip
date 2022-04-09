export const extractWithdrawMemo = async (
  message,
  filteredMessage,
) => {
  let memo = message;
  const regOne = new RegExp(`${filteredMessage[parseInt(0, 10)]}`, 's');
  const regTwo = new RegExp(`${filteredMessage[parseInt(1, 10)]}`, 's');
  const regThree = new RegExp(`${filteredMessage[parseInt(2, 10)]}`, 's');
  const regFour = new RegExp(`${filteredMessage[parseInt(3, 10)]}`, 's');
  memo = memo.replace(regOne, "");
  memo = memo.replace(regTwo, "");
  memo = memo.replace(regThree, "");
  memo = memo.replace(regFour, "");
  memo = memo.trim();
  return memo;
};
