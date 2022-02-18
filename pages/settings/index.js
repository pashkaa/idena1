import React, {useState} from 'react'
import {margin} from 'polished'
import {useTranslation} from 'react-i18next'
import {Flex as ChakraFlex, Text, useClipboard} from '@chakra-ui/react'
import QRCode from 'qrcode.react'
import {saveAs} from 'file-saver'
import theme, {rem} from '../../shared/theme'
import Flex from '../../shared/components/flex'
import SettingsLayout from './layout'
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  FormLabel,
  Input,
  PasswordInput,
} from '../../shared/components/components'
import {
  FlatButton,
  PrimaryButton,
  SecondaryButton,
} from '../../shared/components/button'
import {
  useAuthDispatch,
  useAuthState,
} from '../../shared/providers/auth-context'
import {Section} from '../../screens/settings/components'
import {useEpoch} from '../../shared/providers/epoch-context'
import {useNotificationDispatch} from '../../shared/providers/notification-context'
import db from '../../shared/utils/db'
import {readValidationLogs} from '../../shared/utils/logs'

function Settings() {
  return (
    <SettingsLayout>
      <ExportPK />
      <ExportLogs />
    </SettingsLayout>
  )
}

function ExportLogs() {
  const epochData = useEpoch()
  const {t} = useTranslation()
  const {coinbase} = useAuthState()

  const {addError} = useNotificationDispatch()

  const getLogs = async () => {
    try {
      const epoch = epochData.epoch - 1

      const logs = await readValidationLogs(epoch)

      const blob = new Blob(
        [logs.map(x => `${x.timestamp} - ${JSON.stringify(x.log)}`).join('\n')],
        {
          type: 'text/plain;charset=utf-8',
        }
      )
      saveAs(blob, `validation-${epoch}-${coinbase}.txt`)
    } catch (e) {
      addError({title: 'Cannot export logs', body: e.message})
    }
  }

  return (
    <Section title={t('Test logs')}>
      <PrimaryButton onClick={getLogs}>{t('Export')}</PrimaryButton>
    </Section>
  )
}

function ExportPK() {
  const {t} = useTranslation()

  const [password, setPassword] = useState()
  const [showDialog, setShowDialog] = useState()

  const [pk, setPk] = useState('')
  const {onCopy, hasCopied} = useClipboard(pk)

  const {exportKey} = useAuthDispatch()



}

export default Settings
