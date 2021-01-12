<template>
  <span>
    <slot />
  </span>
</template>
<script>
export default {
  name: 'websocket',
  data() {
    return {
      ws: null,
    }
  },
  props: {
    host: {type: String, required: true},
  },
  created() {
    // 响应socket服务器URL变更
    let self = this
    self.$eventBus.$on('wsChanged', (wsUrl) => {
      //console.log('更改连接中')
      //console.log(self.ws)
      self.host = wsUrl
      self.ws.close()
      self.ws = null
      self.wsInit()
      //console.log(self.ws)
    })
  },
  mounted() {
    // 根据传入的host地址初始化websocket
    this.wsInit()
  },
  destroyed() {
    this.ws.close()
  },
  methods: {
    wsInit: function() {
      this.ws = new WebSocket(this.host)
      this.ws.onclose = this.wsEventClose
      this.ws.onerror = this.wsEventError
      this.ws.onopen = this.wsEventOpen
    },
    wsEventOpen: function() {
      console.log('WebSocker opened!' + this.ws.url)
      //console.log(this.$eventBus);
      this.$eventBus.$emit('wsOpened', this.ws)
    },
    wsEventClose: function() {
      this.$eventBus.$emit('wsClosed', this.ws)
      console.debug('WebSocket closed. ' + this.ws.url)
    },
    wsEventError: function(error) {
      this.$eventBus.$emit('wsError', this.ws)
      console.log('WebSocket连接错误！')
    },
    wsEventMessage: function(message) {
      console.debug(message)
    },
  },
}
</script>
