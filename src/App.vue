<template>
  <div>
    <b-navbar type="is-light">
      <template slot="brand">
        <b-navbar-item tag="div">
          <embed src="./logo-1.svg" width="234.1" height="60" alt="QWebChannel" />
        </b-navbar-item>
        <b-navbar-item>V1.4</b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="div">
          <b-field label="WebSocket服务器地址：" label-position="on-border" style="width: 100%">
            <b-input placeholder="WebSocket服务器地址" type="text" v-model="wsUrl" />
            <p class="control">
              <b-button class="button is-info" @click="changeWs">连接</b-button>
            </p>
          </b-field>
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="div">
          <ws-server :host="wsUrl"> </ws-server>
          <label>
            服务器状态：
            <span>{{ wsStatus }}</span>
          </label>
        </b-navbar-item>
      </template>
    </b-navbar>
    <qt-web-channel />
    <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="true" />
  </div>
</template>

<script>
import QtWebChannel from './components/QtWebChannel.vue'
import WsServer from './components/WebScoket'

export default {
  name: 'App',
  components: {
    QtWebChannel,
    WsServer,
  },
  data() {
    return {
      wsUrl: 'ws://localhost:1700/webchannel',
      wsStatus: '待连接',
      isLoading: false,
    }
  },
  created() {
    this.$eventBus.$on('wsOpened', (ws) => {
      this.wsStatus = '已连接'
      this.isLoading = false
    })
    this.$eventBus.$on('wsClosed', (ws) => {
      this.wsStatus = '已关闭'
      this.isLoading = false
    })
    this.$eventBus.$on('wsError', (ws) => {
      this.wsStatus = '连接错误'
      this.isLoading = false
    })
  },
  methods: {
    changeWs: function() {
      this.$eventBus.$emit('wsChanged', this.wsUrl)
      this.isLoading = true
    },
  },
}
</script>
