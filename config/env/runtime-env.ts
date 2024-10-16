import { EnvNamespace } from '@/../helpers'

export const config: EnvNamespace.IRuntimeEnv[] = [
  {
    key: 'Develop',
    serverBaseUrls: [
      {
        key: 'api',
        development: 'https://dev-monitor.wise-apps.com',
        production: 'https://dev-monitor.wise-apps.com',
      },
    ]
  },
  {
    key: 'Preview',
    serverBaseUrls: [
      {
        key: 'api',
        development: 'https://monitor.wise-apps.com',
        production: 'https://monitor.wise-apps.com',
      },
    ]
  },
  {
    key: 'Test',
    serverBaseUrls: [
      {
        key: 'api',
        development: 'https://qa-sm-dev-02.ushop-plus.com',
        production: 'https://qa-sm-dev-02.ushop-plus.com',
      },
    ]
  },
]
