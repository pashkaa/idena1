export const IdentityStatus = {
  Undefined: 'Undefined',
  Invite: 'Invite',
  Candidate: 'Candidate',
  Newbie: 'Newbie',
  Verified: 'Verified',
  Suspended: 'Suspended',
  Zombie: 'Zombie',
  Terminating: 'Terminating',
  Human: 'Human',
}

export const EpochPeriod = {
  FlipLottery: 'FlipLottery',
  ShortSession: 'ShortSession',
  LongSession: 'LongSession',
  AfterLongSession: 'AfterLongSession',
  None: 'None',
}

export const AnswerType = {
  None: 0,
  Left: 1,
  Right: 2,
  Inappropriate: 3,
}

export const SessionType = {
  Short: 'short',
  Long: 'long',
  Qualification: 'qualification',
}

export const FlipType = {
  Publishing: 'publishing',
  Published: 'published',
  Draft: 'draft',
  Archived: 'archived',
  Deleting: 'deleting',
  Invalid: 'invalid',
}

export const FlipFilter = {
  Active: 'active',
  Draft: 'draft',
  Archived: 'archived',
}

export const NodeType = {
  Miner: 'miner',
  Delegator: 'delegator',
}

export const TxType = {
  SendTx: 0x0,
  ActivationTx: 0x1,
  InviteTx: 0x2,
  KillTx: 0x3,
  SubmitFlipTx: 0x4,
  SubmitAnswersHashTx: 0x5,
  SubmitShortAnswersTx: 0x6,
  SubmitLongAnswersTx: 0x7,
  EvidenceTx: 0x8,
  OnlineStatusTx: 0x9,
  KillInviteeTx: 0xa,
  ChangeGodAddressTx: 0xb,
  BurnTx: 0xc,
  ChangeProfileTx: 0xd,
  DeleteFlipTx: 0xe,
  DeployContractTx: 0xf,
  CallContractTx: 0x10,
  TerminateContractTx: 0x11,
  DelegateTx: 0x12,
  UndelegateTx: 0x13,
  KillDelegatorTx: 0x14,
  StoreToIpfsTx: 0x15,
}

export const OnboardingStep = {
  ActivateInvite: 'activateInvite',
  Validate: 'validate',
  CreateFlips: 'createFlips',
  FlipLottery: 'flipLottery',
  WaitingValidationResults: 'waitingValidationResults',
  ActivateMining: 'activateMining',
}

export const CertificateType = {
  Beginner: 0,
  Expert: 1,
  Master: 2,
}

export const CertificateActionType = {
  None: 0,
  Requested: 1,
  Passed: 2,
  Failed: 3,
}

export const RelevanceType = {
  Relevant: 1,
  Irrelevant: 2,
}
