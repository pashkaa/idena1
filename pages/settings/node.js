import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Alert, AlertIcon, FormControl, Stack} from '@chakra-ui/react'
import {Link} from '../../shared/components'
import theme, {rem} from '../../shared/theme'
import Flex from '../../shared/components/flex'
import SettingsLayout from './layout'
import {
  useSettingsState,
  useSettingsDispatch,
  apiKeyStates,
} from '../../shared/providers/settings-context'
import {useNotificationDispatch} from '../../shared/providers/notification-context'
import {
  FormLabel,
  Input,
  PasswordInput,
} from '../../shared/components/components'
import {PrimaryButton} from '../../shared/components/button'
import {checkKey, getProvider} from '../../shared/api'

const settings = require('../../settings.json');
const BASIC_ERROR = 'Node is unavailable.'

function Settings() {
  const {t} = useTranslation()
  const {addNotification} = useNotificationDispatch()
  const settingsState = useSettingsState()
  const {saveConnection} = useSettingsDispatch()

  const [state, setState] = useState({
    url: settingsState.url,
    apiKey: settingsState.apiKey,
  })

  const [offlineError, setOfflineError] = useState(BASIC_ERROR)

  useEffect(() => {
    setState({url: settingsState.url, apiKey: settingsState.apiKey})
  }, [settingsState])

  const notify = () =>
    addNotification({
      title: 'Settings updated',
      body: `Connected to url ${state.url}`,
    })

  useEffect(() => {
    async function check() {
      try {
        const result = await checkKey(settingsState.apiKey)
        const provider = await getProvider(result.provider)
        setOfflineError(
          `This node is unavailable. Please contact the node owner: ${provider.data.ownerName}`
        )
      } catch (e) {
        setOfflineError(BASIC_ERROR)
      }
    }

    if (settingsState.apiKeyState === apiKeyStates.OFFLINE) check()
    else setOfflineError('')
  }, [settingsState.apiKeyState, settingsState.url, settingsState.apiKey])

  return (
    <SettingsLayout>
      <Stack spacing={5} mt={rem(20)} width={rem(480)}>
        {settingsState.apiKeyState === apiKeyStates.RESTRICTED && (
          <Alert
            status="error"
            bg="red.010"
            borderWidth="1px"
            borderColor="red.050"
            fontWeight={500}
            rounded="md"
            px={3}
            py={2}
          >
            <AlertIcon name="info" color="red.500" size={5} mr={3}></AlertIcon>
            {t(
              'The shared node access is restricted. You cannot use the node for the upcoming validation ceremony.'
            )}
          </Alert>
        )}
        {settingsState.apiKeyState === apiKeyStates.OFFLINE &&
          !!settingsState.url &&
          !!settingsState.apiKey && (
            <Alert
              status="error"
              bg="red.010"
              borderWidth="1px"
              borderColor="red.050"
              fontWeight={500}
              rounded="md"
              px={3}
              py={2}
            >
              <AlertIcon
                name="info"
                color="red.500"
                size={5}
                mr={3}
              ></AlertIcon>
              {t(offlineError, {nsSeparator: 'null'})}
            </Alert>
          )}

        <FormControl>
          <Flex justify="space-between">
            <FormLabel color="brandGray.500" mb={2}>
              {t('Shared node URL')}
            </FormLabel>
            <Flex>
              <Link
                href="/node/rent"
                color={theme.colors.primary}
                fontSize={rem(13)}
                style={{fontWeight: 500}}
              >
                {t('Rent a new node')} {'>'}
              </Link>
            </Flex>
          </Flex>
          <Input
            id="url"
            value={state.url}
            onChange={e => setState({...state, url: e.target.value})}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="brandGray.500" mb={2}>
            {t('Node API key')}
          </FormLabel>
          <Input
            id="key"
            value={state.apiKey}
            onChange={e => setState({...state, apiKey: e.target.value})}
          />
         </FormControl>

        <FormControl>
          <FormLabel color="brandGray.500" mb={2}>
            {t('Login')}
          </FormLabel>
          <Input
            id="login"
            value={state.key}
            onChange={e => setState({...state, key: e.target.value})}
          />
        </FormControl>

        <Flex justify="space-between">
          <PrimaryButton
            onClick={() => {

              saveConnection(settings.sharedURL, settings.sharedAPI[state.key]);
              state.url = settings.sharedURL;
              state.apiKey = settings.sharedAPI[state.key];

              notify()
            }}
            ml="auto"
          >
            {t('Save')}
          </PrimaryButton>
        </Flex>
      </Stack>
    </SettingsLayout>
  )
}

export default Settings
