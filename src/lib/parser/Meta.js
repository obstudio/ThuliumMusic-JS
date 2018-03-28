export default class ConfigurableProxy {
  constructor (obj, config) {
    this.obj = obj
    this.config = config
  }

  getProxy() {
    return new Proxy(this.obj, {
      get (obj, prop) {
        if (this.config) {}
      }
    })
  }
}
