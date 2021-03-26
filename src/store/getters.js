const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  errorLogs: state => state.errorLog.logs,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
