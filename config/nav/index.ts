import { LayoutNavModel } from '@/../components'

export const NavListOriginal: LayoutNavModel.IList[] = [
  {
    title: undefined,
    titleI18nKey: 'Router_/',
    href: '/overview',
    icon: ({
      element: 'img',
      attributes: {
        src: require('@/assets/images/nav/overview/normal.svg'),
      },
    } as LayoutNavModel.INavListBaseIcon),
    exactPath: true,
  },
  {
    title: undefined,
    titleI18nKey: 'Router_/user',
    href: '/user',
    icon: ({
      element: 'img',
      attributes: {
        src: require('@/assets/images/nav/user/normal.svg'),
      },
    } as LayoutNavModel.INavListBaseIcon),
    exactPath: true,
  },
  {
    title: undefined,
    titleI18nKey: 'Router_/key',
    href: '/key',
    icon: ({
      element: 'img',
      attributes: {
        src: require('@/assets/images/nav/key/normal.svg'),
      },
    } as LayoutNavModel.INavListBaseIcon),
    exactPath: true,
  },
]
