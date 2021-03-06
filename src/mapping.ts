import {
  KickReward,
  RewardPaid,
  Staked,
  Withdrawn
} from "../generated/CvxLocker/CvxLocker"
import {Lock, Reward, Withdrawal} from "../generated/schema"
import {getUser} from "./utils/users";
import {
  getEventId, updateAggregatedLocks,
  updateAggregatedRewards, updateAggregatedWithdrawals
} from "./utils/events";
import {getOrCreateToken} from "./utils/tokens";
import {CVX_TOKEN} from "./utils/constants";
import {getUSDRate} from "./utils/prices"
import {Address} from '@graphprotocol/graph-ts';
import {exponentToBigDecimal} from "./utils/maths";

let cvx = getOrCreateToken(CVX_TOKEN);

export function handleKickReward(event: KickReward): void {

  let user = getUser(event.params._user);
  let reward = new Reward(getEventId(event));
  reward.user = user.id;
  reward.amount = event.params._reward;
  reward.amountUSD = getUSDRate(CVX_TOKEN).times(reward.amount.toBigDecimal()
      .div(exponentToBigDecimal(cvx.decimals)));
  reward.token = cvx.id;
  reward.time = event.block.timestamp;
  reward.save()

  updateAggregatedRewards(reward.time,
      cvx,
      reward.amount,
      reward.amountUSD
      );

}

export function handleRewardPaid(event: RewardPaid): void {

  let user = getUser(event.params._user);
  let reward = new Reward(getEventId(event));
  reward.user = user.id;
  reward.amount = event.params._reward;
  let token = getOrCreateToken(event.params._rewardsToken);
  reward.amountUSD = getUSDRate(Address.fromString(token.id)).times(reward.amount.toBigDecimal()
      .div(exponentToBigDecimal(token.decimals)));
  reward.token = token.id;
  reward.time = event.block.timestamp;
  reward.save();

  updateAggregatedRewards(reward.time,
      token,
      reward.amount,
      reward.amountUSD);
}

export function handleStaked(event: Staked): void {

  let user = getUser(event.params._user);
  let lock = new Lock(getEventId(event));
  lock.user = user.id;
  lock.lockAmount = event.params._lockedAmount;
  lock.amountUSD = getUSDRate(CVX_TOKEN).times(lock.lockAmount.toBigDecimal().div(exponentToBigDecimal(cvx.decimals)));
  lock.boostedAmount = event.params._boostedAmount;
  lock.time = event.block.timestamp;
  user.totalLocked = user.totalLocked.plus(lock.lockAmount);
  user.save();
  lock.save();
  updateAggregatedLocks(lock.time, lock.lockAmount,
      lock.amountUSD);
}

export function handleWithdrawn(event: Withdrawn): void {

  let user = getUser(event.params._user);
  let withdrawal = new Withdrawal(getEventId(event));
  withdrawal.user = user.id;
  withdrawal.amount = event.params._amount;
  withdrawal.amountUSD = getUSDRate(CVX_TOKEN).times(withdrawal.amount.toBigDecimal().div(exponentToBigDecimal(cvx.decimals)));
  withdrawal.time = event.block.timestamp;
  user.totalLocked = user.totalLocked.minus(withdrawal.amount);
  user.save();
  withdrawal.save();
  updateAggregatedWithdrawals(withdrawal.time, withdrawal.amount,
      withdrawal.amountUSD)
}
