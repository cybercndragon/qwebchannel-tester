<template>
  <section>
    <b-tabs size="is-medium" vertical type="is-boxed">
      <template v-for="(qObj, objName) in channelObjs">
        <b-tab-item
          :key="objName"
          :value="objName"
          :label="objName"
          icon="alpha-q-circle"
        >
          <object-viewer :qtobject="qObj" />
        </b-tab-item>
      </template>
    </b-tabs>
  </section>
</template>

<script>
import { QWebChannel } from "qwebchannel";
import ObjectViewer from "./QtObjectViewer";

export default {
  name: "QtWebChannel",
  components: {
    ObjectViewer,
  },
  data() {
    return {
      activeTab: 0,
      channelObjs: {},
    };
  },
  created() {
    // 响应 websocket 服务器连接成功的事件
    let self = this;
    this.$eventBus.$on("wsOpened", (ws) => {
      console.log("Connected to WebChannel, ready to send/receive messages! ");

      self.activeTab = 0;
      new QWebChannel(ws, function (channel) {
        self.channelObjs = channel.objects;
        window.qobjs = channel.objects;
      });
    });
  },
};
</script>
