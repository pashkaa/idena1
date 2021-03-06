import React, {useEffect, useRef} from 'react'
import App from 'next/app'
import {useRouter} from 'next/router'
import Head from 'next/head'
import GoogleFonts from 'next-google-fonts'
import {QueryClient, QueryClientProvider} from 'react-query'
import ReactGA from 'react-ga'
import {v4 as uuidv4} from 'uuid'
import TagManager from 'react-gtm-module'

import '../i18n'
import 'focus-visible/dist/focus-visible'

import {Box, ChakraProvider, extendTheme} from '@chakra-ui/react'
import {uiTheme} from '../shared/theme'

import {NotificationProvider} from '../shared/providers/notification-context'
import {SettingsProvider} from '../shared/providers/settings-context'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'tui-image-editor/dist/tui-image-editor.css'
import {AuthProvider} from '../shared/providers/auth-context'
import Flips from '../shared/components/flips'
import {AppProvider} from '../shared/providers/app-context'
import {IdentityProvider} from '../shared/providers/identity-context'
import {EpochProvider} from '../shared/providers/epoch-context'
import {OnboardingProvider} from '../shared/providers/onboarding-context'
import {TestValidationProvider} from '../shared/providers/test-validation-context'

export default class MyApp extends App {
  render() {
    const {Component, pageProps} = this.props

    // Workaround for https://github.com/zeit/next.js/issues/8592
    const {err} = this.props

    return (
      <>
        <GoogleFonts href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" />
        <Head>
          <meta charSet="UTF-8" />
          <title>Test on Web</title>
          <meta httpEquiv="X-UA-Compatible" content="chrome=1" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"
          />
          <meta
            name="description"
            content="Take part in the test ceremony using your browser"
          />

          <link rel="shortcut icon" href="/favicon.ico" />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link href="/static/fonts/icons.css" rel="stylesheet" />
          <link href="/static/scrollbars.css" rel="stylesheet" />
          <style>{`
            html {
              -moz-osx-font-smoothing: grayscale;
            }
          `}</style>
          <script
            type="text/javascript"
            src="https://apis.google.com/js/api.js"
          ></script>
        </Head>
        <ChakraProvider theme={extendTheme(uiTheme)}>
          <IdenaApp>
            <Component {...{...pageProps, err}} />
          </IdenaApp>
        </ChakraProvider>
      </>
    )
  }
}

// Create a client
const queryClient = new QueryClient()

// eslint-disable-next-line react/prop-types
function AppProviders({tabId, ...props}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <TestValidationProvider>
            <EpochProvider>
              <IdentityProvider>
                <AppProvider tabId={tabId}>
                  <Flips />
                  <OnboardingProvider>
                    <NotificationProvider {...props} />
                  </OnboardingProvider>
                </AppProvider>
              </IdentityProvider>
            </EpochProvider>
          </TestValidationProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  )
}

function IdenaApp(props) {
  const router = useRouter()

  const id = useRef(uuidv4())

  useEffect(() => {
    ReactGA.initialize('UA-139651161-3')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  useEffect(() => {
    TagManager.initialize({gtmId: 'GTM-P4K5GX4'})
  }, [])

  useEffect(() => {
    const handleRouteChange = url => {
      ReactGA.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return ['/certificate/[id]', '/too-many-tabs'].includes(router.pathname) ? (
    <QueryClientProvider client={queryClient}>
      <Box {...props} />
    </QueryClientProvider>
  ) : (
    <AppProviders tabId={id.current} {...props} />
  )
}
