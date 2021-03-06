import React, {useEffect} from 'react'
import {
  Box,
  Heading,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {useTranslation} from 'react-i18next'
import {useQuery, useQueryClient} from 'react-query'
import {useRouter} from 'next/router'
import {Page, PageTitle} from '../screens/app/components'
import {
  UserInlineCard,
  SimpleUserStat,
  UserStatList,
  UserStat,
  UserStatLabel,
  UserStatValue,
  AnnotatedUserStat,
  ActivateInviteForm,
  ValidationResultToast,
  ActivateMiningForm,
  KillForm,
} from '../screens/profile/components'
import Layout from '../shared/components/layout'
import {IdentityStatus, OnboardingStep} from '../shared/types'
import {
  toPercent,
  toLocaleDna,
  eitherState,
  openExternalUrl,
} from '../shared/utils/utils'
import {hasPersistedValidationResults} from '../screens/validation/utils'
import {useIdentity} from '../shared/providers/identity-context'
import {useEpoch} from '../shared/providers/epoch-context'
import {fetchBalance} from '../shared/api/wallet'
import {useAuthState} from '../shared/providers/auth-context'
import {IconButton} from '../shared/components/button'
import {validDnaUrl} from '../shared/utils/dna-link'
import {DnaSignInDialog} from '../screens/dna/containers'
import {ExternalLink, TextLink, Toast} from '../shared/components/components'
import {useOnboarding} from '../shared/providers/onboarding-context'
import {
  OnboardingPopover,
  OnboardingPopoverContent,
  OnboardingPopoverContentIconRow,
} from '../shared/components/onboarding'
import {onboardingShowingStep} from '../shared/utils/onboarding'
import {useScroll} from '../shared/hooks/use-scroll'
import {
  AddUserIcon,
  ChevronDownIcon,
  DeleteIcon,
  PhotoIcon,
  TelegramIcon,
  TestValidationIcon,
} from '../shared/components/icons'

export default function ProfilePage() {
  const queryClient = useQueryClient()

  const {
    t,
    i18n: {language},
  } = useTranslation()

  const [
    {
      address,
      state,
      penalty,
      age,
      totalShortFlipPoints,
      totalQualifiedFlips,
      online,
      delegatee,
      delegationEpoch,
      canMine,
      canInvite,
      canTerminate,
      canActivateInvite,
    },
  ] = useIdentity()

  const router = useRouter()

  const epoch = useEpoch()
  const {coinbase, privateKey} = useAuthState()

  const [showValidationResults, setShowValidationResults] = React.useState()

  const {
    isOpen: isOpenKillForm,
    onOpen: onOpenKillForm,
    onClose: onCloseKillForm,
  } = useDisclosure()

  const {
    data: {balance, stake},
  } = useQuery(['get-balance', address], () => fetchBalance(address), {
    initialData: {balance: 0, stake: 0},
    enabled: !!address,
    refetchInterval: 30 * 1000,
  })

  useEffect(() => {
    if (epoch) {
      const {epoch: epochNumber} = epoch
      if (epochNumber) {
        queryClient.invalidateQueries('get-balance')
        setShowValidationResults(hasPersistedValidationResults(epochNumber))
      }
    }
  }, [epoch, queryClient])

  const {
    isOpen: isOpenDnaSignInDialog,
    onOpen: onOpenDnaSignInDialog,
    onClose: onCloseDnaSignInDialog,
  } = useDisclosure()

  const [dnaUrl, setDnaUrl] = React.useState(() =>
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('dnaUrl'))
      : null
  )

  React.useEffect(() => {
    if (dnaUrl && validDnaUrl(dnaUrl.route)) {
      onOpenDnaSignInDialog()
    } else {
      sessionStorage.removeItem('dnaUrl')
      onCloseDnaSignInDialog()
    }
  }, [dnaUrl, onCloseDnaSignInDialog, onOpenDnaSignInDialog])

  const toast = useToast()

  const toDna = toLocaleDna(language)

  const [
    currentOnboarding,
    {dismissCurrentTask, next: nextOnboardingTask},
  ] = useOnboarding()

  const eitherOnboardingState = (...states) =>
    eitherState(currentOnboarding, ...states)

  const {
    isOpen: isOpenActivateInvitePopover,
    onOpen: onOpenActivateInvitePopover,
    onClose: onCloseActivateInvitePopover,
  } = useDisclosure()

  const activateInviteRef = React.useRef()

  const {scrollTo: scrollToActivateInvite} = useScroll(activateInviteRef)

  React.useEffect(() => {
    if (
      isOpenActivateInvitePopover ||
      eitherState(
        currentOnboarding,
        onboardingShowingStep(OnboardingStep.ActivateInvite)
      )
    ) {
      scrollToActivateInvite()
      onOpenActivateInvitePopover()
    } else onCloseActivateInvitePopover()
  }, [
    currentOnboarding,
    isOpenActivateInvitePopover,
    onCloseActivateInvitePopover,
    onOpenActivateInvitePopover,
    scrollToActivateInvite,
  ])

  return (
    <Layout canRedirect={!dnaUrl}>
      <Page>
        <PageTitle mb={8}>{t('Waiting page ...')}</PageTitle>
        <Stack isInline spacing={10}>
          <Stack spacing={8} w={480} ref={activateInviteRef}>


            {canActivateInvite && (
              <Box>
                <OnboardingPopover
                  isOpen={isOpenActivateInvitePopover}
                  placement="bottom"
                >
                  <PopoverTrigger>
                    <Stack
                      spacing={6}
                      bg="white"
                      borderRadius="lg"
                      boxShadow="0 3px 12px 0 rgba(83, 86, 92, 0.1), 0 2px 3px 0 rgba(83, 86, 92, 0.2)"
                      px={10}
                      py={8}
                      pos="relative"
                      zIndex="docked"
                    >
                      <Stack>
                        <Heading as="h3" fontWeight={500} fontSize="lg">
                          {state === IdentityStatus.Invite
                            ? t('Congratulations!')
                            : t('Join the upcoming validation')}
                        </Heading>
                        <Text color="muted">
                          {state === IdentityStatus.Invite
                            ? t(
                                'You have been invited to join the upcoming validation ceremony. Click the button below to accept the invitation.'
                              )
                            : t(
                                'To take part in the validation, you need an invitation code. Invitations can be provided by validated identities.'
                              )}
                        </Text>
                      </Stack>
                      <Box>
                        <ActivateInviteForm
                          onHowToGetInvitation={onOpenActivateInvitePopover}
                        />
                      </Box>
                    </Stack>
                  </PopoverTrigger>
                  <OnboardingPopoverContent
                    gutter={10}
                    title={t('How to get an invitation code')}
                    zIndex={2}
                    onDismiss={() => {
                      dismissCurrentTask()
                      onCloseActivateInvitePopover()
                    }}
                  >
                    <Stack spacing={5}>
                      <Stack>
                        <Text fontSize="sm">
                          {t(
                            '1. Join the official Idena public Telegram group and follow instructions in the pinned message.'
                          )}
                        </Text>
                        <OnboardingPopoverContentIconRow
                          icon={<TelegramIcon boxSize={5} />}
                          _hover={{
                            bg: '#689aff',
                          }}
                          px={4}
                          py={2}
                          cursor="pointer"
                          onClick={() => {
                            const win = openExternalUrl(
                              'https://t.me/IdenaNetworkPublic'
                            )
                            win.focus()
                          }}
                          borderRadius="lg"
                        >
                          <Box>
                            <Text p={0} py={0} h={18} fontSize="md">
                              https://t.me/IdenaNetworkPublic
                            </Text>
                            <Text
                              fontSize="sm"
                              color="rgba(255, 255, 255, 0.56)"
                            >
                              {t('Official group')}
                            </Text>
                          </Box>
                        </OnboardingPopoverContentIconRow>
                        <Text fontSize="sm">
                          {t(
                            '2. Pass the training validation and get a certificate which you can provide to a validated member to get an invitation code'
                          )}
                        </Text>
                        <OnboardingPopoverContentIconRow
                          icon={
                            <TestValidationIcon boxSize={5} color="white" />
                          }
                          _hover={{
                            bg: '#689aff',
                          }}
                          px={4}
                          py={2}
                          cursor="pointer"
                          onClick={() => router.push('/try')}
                          borderRadius="lg"
                        >
                          <Box>
                            <Text p={0} py={0} h={18} fontSize="md">
                              {t('Test yourself')}
                            </Text>
                            <Text
                              fontSize="sm"
                              color="rgba(255, 255, 255, 0.56)"
                            >
                              {t('Training validation')}
                            </Text>
                          </Box>
                        </OnboardingPopoverContentIconRow>
                      </Stack>
                    </Stack>
                  </OnboardingPopoverContent>
                </OnboardingPopover>
              </Box>
            )}
            {state &&
              ![
                IdentityStatus.Undefined,
                IdentityStatus.Invite,
                IdentityStatus.Candidate,
              ].includes(state) }

          </Stack>


        </Stack>

        <KillForm isOpen={isOpenKillForm} onClose={onCloseKillForm}></KillForm>

        {showValidationResults && epoch && (
          <ValidationResultToast epoch={epoch.epoch} />
        )}

        {dnaUrl && (
          <DnaSignInDialog
            isOpen={isOpenDnaSignInDialog}
            query={dnaUrl?.query}
            onDone={() => setDnaUrl('')}
            onError={error =>
              toast({
                status: 'error',
                // eslint-disable-next-line react/display-name
                render: () => <Toast status="error" title={error} />,
              })
            }
            onClose={onCloseDnaSignInDialog}
          />
        )}
      </Page>
    </Layout>
  )
}
