import { BigInt } from "@graphprotocol/graph-ts"
import {
  CvxLocker,
  KickReward,
  OwnershipTransferred,
  Recovered,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn
} from "../generated/CvxLocker/CvxLocker"
import { ExampleEntity } from "../generated/schema"

export function handleKickReward(event: KickReward): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity._user = event.params._user
  entity._kicked = event.params._kicked

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceAtEpochOf(...)
  // - contract.balanceOf(...)
  // - contract.balances(...)
  // - contract.boostPayment(...)
  // - contract.boostRate(...)
  // - contract.boostedSupply(...)
  // - contract.claimableRewards(...)
  // - contract.cvxCrv(...)
  // - contract.cvxcrvStaking(...)
  // - contract.decimals(...)
  // - contract.denominator(...)
  // - contract.epochCount(...)
  // - contract.epochs(...)
  // - contract.findEpochId(...)
  // - contract.getRewardForDuration(...)
  // - contract.isShutdown(...)
  // - contract.kickRewardEpochDelay(...)
  // - contract.kickRewardPerEpoch(...)
  // - contract.lastTimeRewardApplicable(...)
  // - contract.lockDuration(...)
  // - contract.lockedBalanceOf(...)
  // - contract.lockedBalances(...)
  // - contract.lockedSupply(...)
  // - contract.maximumBoostPayment(...)
  // - contract.maximumStake(...)
  // - contract.minimumStake(...)
  // - contract.name(...)
  // - contract.nextBoostRate(...)
  // - contract.nextMaximumBoostPayment(...)
  // - contract.owner(...)
  // - contract.rewardData(...)
  // - contract.rewardDistributors(...)
  // - contract.rewardPerToken(...)
  // - contract.rewardTokens(...)
  // - contract.rewardWeightOf(...)
  // - contract.rewards(...)
  // - contract.rewardsDuration(...)
  // - contract.stakeOffsetOnLock(...)
  // - contract.stakingProxy(...)
  // - contract.stakingToken(...)
  // - contract.symbol(...)
  // - contract.totalSupply(...)
  // - contract.totalSupplyAtEpoch(...)
  // - contract.userLocks(...)
  // - contract.userRewardPerTokenPaid(...)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRecovered(event: Recovered): void {}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardPaid(event: RewardPaid): void {}

export function handleStaked(event: Staked): void {}

export function handleWithdrawn(event: Withdrawn): void {}
