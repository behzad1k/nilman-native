const formatUrl = (endpoint: string) => `/${endpoint}/`
const ENDPOINTS = {
  AUTH: {
    LOGIN: formatUrl('login'),
    VERIFY: formatUrl('check')
  },
  USER: {
    INDEX: formatUrl('user'),
    WORKERS: formatUrl('user/workers')
  },
  SERVICE: {
    INDEX: formatUrl('service')
  },
  ORDER: {
    INDEX: formatUrl('order'),
    CART: formatUrl('order/cart')
  },
  ADDRESS: {
    INDEX: formatUrl('address'),
    SIMPLE_SEARCH: formatUrl('address/simple-search'),
    GEO_CODE: formatUrl('address/geocode'),
  },
  GLOBAL: {
    COLOR: formatUrl('color')
  }
} as const

export default ENDPOINTS