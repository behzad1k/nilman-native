const formatUrl = (endpoint: string) => `/${endpoint}/`
const ENDPOINTS = {
  USER: {},
  SERVICE: {
    INDEX: formatUrl('service')
  }
} as const

export default ENDPOINTS