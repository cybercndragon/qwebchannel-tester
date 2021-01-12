<template>
  <div>
    <b-collapse
      class="card"
      animation="slide"
      v-for="(prop, idx) of qObjProps"
      :key="idx"
      :open="isOpen == idx"
      @open="isOpen = idx"
    >
      <div slot="trigger" slot-scope="props" class="card-header" role="button">
        <p class="card-header-title">
          <span class="tag">{{ prop.type }}</span> {{ prop.name }}
        </p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
      <div class="card-content">
        <div class="content" v-if="prop.type == 'property'">
          <table class="table is-fullwidth">
            <tbody>
              <tr>
                <th class="has-text-right is-narrow">说明：</th>
                <td>
                  <p>
                    封装Qt对象的属性，QWebChannel在封装对象时已经将该属性值缓存在前端，可以直接像普通对象的属性一样调用。
                  </p>
                  <p>
                    每个属性一般还有一个对应的
                    <strong>{{ prop.name }}Changed</strong>
                    信号函数，可以订阅以及时跟踪到该属性值的变化。
                  </p>
                  <p>属性的值可以是一个数字、字符串、bool，也可以是一个JSON对象。如果属性值为JSON对象，可用直接使用“.”号获取对象下一级的属性。</p>
                </td>
              </tr>
              <tr>
                <th class="has-text-right is-narrow">用法：</th>
                <td>
                  <pre v-highlightjs>
                      <code class="javascript">
// 获取属性值，直接获取客户端缓存的值，不需要异步等待
var result = {{qtobject.__id__}}.{{prop.name}}
// 更改属性值，会更改客户端缓存的实例值，然后远端服务器会收到这个属性变更的异步通知
{{qtobject.__id__}}.{{prop.name}} = "Hello World"

// 订阅属性的变化
{{qtobject.__id__}}.{{prop.name}}Changed.connect(function() {
  result = {{qtobject.__id__}}.{{prop.name}}
})
                      </code>
                    </pre>
                </td>
              </tr>
              <tr>
                <th class="has-text-right is-narrow">当前值：</th>
                <td>
                  <div>
                    <button
                      @click="handleProperty(prop)"
                      @load="handleProperty(prop)"
                    >
                      更新当前值
                    </button>
                  </div>
                  <pre
                    v-highlightjs
                  ><code class="json" :id="'txt-' + qtobject.__id__ + '_' + prop.name">{{prop.obj}}</code></pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="content" v-if="prop.type == 'slot'">
          <table class="table is-fullwidth">
            <tbody>
              <tr>
                <th class="has-text-right is-narrow">说明：</th>
                <td>
                  封装QT对象的槽函数，可以直接作为对象的函数调用，返回值通过callback函数异步获取。
                </td>
              </tr>
              <tr>
                <th class="has-text-right is-narrow">用法：</th>
                <td>
                  <pre v-highlightjs>
                      <code class="javascript">
var callback = function(result) {
  // Callback 函数，异步接收返回值
  console.log({{prop.name}}'函数调用结果：')
  console.log(result)
  document.getElementById('txt-{{prop.name}}').text = (typeof msg !== 'string' ? JSON.stringify(msg, null, 4) : msg)
}

{{qtobject.__id__}}.{{prop.name.replace(')', ',callback)').replace('(,', '(')}}
                      </code>
                    </pre>
                </td>
              </tr>
              <tr>
                <th class="has-text-right is-narrow">返回值：</th>
                <td>
                  <div>
                    <b-field
                      v-for="(arg, idx) in splitParams(prop.name)"
                      :key="idx"
                    >
                      <b-input
                        :placeholder="'参数' + arg"
                        :name="
                          'param-' +
                          prop.name.substring(0, prop.name.indexOf('('))
                        "
                        type="text"
                      />
                    </b-field>
                  </div>
                  <div class="level">
                    <div class="level-left">
                      <div class="level-item"><b-button @click="handleSolt(prop)">执行</b-button></div>
                      <div class="level-item">
                        <label>最后执行时间：</label>
                        <span>{{prop.lastCallTime}}</span>
                      </div>
                    </div>
                  </div>
                  <pre
                    v-highlightjs
                  ><code class="json"
                  :id="'txt-'+ qtobject.__id__ + '_' + prop.name.substring(0, prop.name.indexOf('('))"></code></pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="content" v-if="prop.type == 'signal'">
          <table class="table is-fullwidth">
            <tbody>
              <tr>
                <th>说明：</th>
                <td>
                  封装QT对象的信号，一旦有相应事件/信号产生，会自动推送到订阅端。信号在javaScript端被封装成一个对象，对象内有connect()和disconnect()两个方法。
                </td>
              </tr>
              <tr>
                <th>用法：</th>
                <td>
                  <pre v-highlightjs>
                      <code class="javascript">
var callback = function(msg) {
  console.log('有新信号产生，信号所发送的内容为：');
  console.log(msg);
  document.getElementById('txt-{{prop.name}}').text += newDate().toLocaleString() + ' - '
                                                    + (typeof msg !== 'string' ? JSON.stringify(msg, null, 4) : msg) + \n;
}

// 连接远端信号通知，订阅其发生的变化
{{qtobject.__id__}}.{{prop.name}}.connect(callback);
// 端口远端信号通知，取消订阅变化
{{qtobject.__id__}}.{{prop.name}}.disconnect();
                      </code>
                    </pre>
                </td>
              </tr>
              <tr>
                <th>测试：</th>
                <td>
                  <div>
                    <button @click="handleSignal(prop, 'connect')">
                      开始订阅
                    </button>
                    <!--<button @click="handleSignal(prop, 'disconnect')">取消订阅</button>-->
                  </div>
                  <div>
                    <textarea
                      :id="'txt-' + qtobject.__id__ + '_' + prop.name"
                      style="width: 100%; height: 5em"
                    ></textarea>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import hljs from "highlight.js/lib/core";

export default {
  name: "QtObjectViewer",
  data() {
    return {
      // 测试信号中的时间
      changeTime: '',
      isOpen: -1,
      qObjProperties: [],
      qObjSolts: [],
      qObjSignals: [],
      sysProperties: [
        "__id__",
        "__objectSignals__",
        "__propertyCache__",
        "objectName",
        "unwrapQObject",
        "unwrapProperties",
        "propertyUpdate",
        "signalEmitted",
        "deleteLater",
        "deleteLater()",
        "destroyed",
        "destroyed(QObject*)",
        "destroyed()",
        "objectNameChanged",
        "__ob__",
      ],
    };
  },
  props: {
    qtobject: {
      type: Object,
      required: true,
    },
    showSysProperty: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    qObjProps: function () {
      let props = [];
      let qobj = this.qtobject;
      let keys = Object.getOwnPropertyNames(qobj);
      let signalKeys = ["connect", "disconnect"];
      //console.log(qobj);

      if (this.showSysProperty) {
        //console.log('== Show All property ==')
      } else {
        //console.log('== Show custom property ==')
        keys = keys.filter((x) => this.sysProperties.indexOf(x) < 0);
        //console.log(keys)
      }
      /*if (qobj.__id__ === 'webZxService') {
        console.log(qobj.taskInfoList)
        console.log(qobj.taskInfoList === qobj.taskInfoList())
      }*/
      keys.forEach(function (propName, idx) {
        let p = { name: propName, obj: qobj[propName] };
        // Start 计算该属性的类型
        if (typeof p.obj === "function") {
          p.type = "slot";
          p.lastCallTime = "";
          p.result = "";
        } else if (typeof p.obj === "object" && p.obj !== null) {
          // 可能是 property 也可能是 signals
          let objKeys = Object.keys(p.obj);
          if (objKeys.sort().toString() == signalKeys.sort().toString()) {
            p.type = "signal";
          } else {
            p.type = "property";
          }
        } else {
          p.type = "property";
        }
        // End 计算该属性的类型
        if (p.name.indexOf("(") > 0) {
          if (p.type === "slot" || p.type === "signal") {
            props.push(p);
          }
        } else if (p.type === "property" || p.type === "signal") {
          props.push(p);
        }
      });
      //console.log(props)
      return props;
    },
  },
  methods: {
    formatResult: function(result) {
      let resultType = typeof result;
      if (resultType === "string") {
        return result
      } else {
        return JSON.stringify(result, null, 4);
      }
    },
    splitParams: function (funcName) {
      let result = funcName
        .slice(funcName.indexOf("(") + 1, funcName.indexOf(")"))
        .split(",");
      if (result.length === 1 && result[0] === "") result = null;
      return result;
    },
    handleProperty: function (prop) {
      // 处理属性的调用
      let block = document.getElementById("txt-" + this.qtobject.__id__ + '_' + prop.name);
      block.innerText =
        typeof prop.obj !== "string"
          ? JSON.stringify(prop.obj, null, 4)
          : prop.obj;
      hljs.highlightBlock(block);
    },
    handleSignal: function (prop, cmd = "connect") {
      let block = document.getElementById("txt-" + this.qtobject.__id__ + '_' + prop.name);
      if (cmd === "connect") {
        block.value += new Date().toLocaleString() + " - 信号开始订阅...\n";
        //let objName = prop.name.indexOf('(') > 0 ? prop.name.substring(0, prop.name.indexOf('(')) : prop.name
        let callback = function (res) {
          let result =
            typeof res !== "string" ? JSON.stringify(res, null, 4) : res;
          //let block = document.getElementById("txt-" + this.qtobject.__id__ + '_' + prop.name);
          block.value += new Date().toLocaleString() + " - 有新信号产生\n";
          if (prop.name.indexOf("(") > 0) {
            let result =
              typeof res !== "string" ? JSON.stringify(res, null, 4) : res;
            block.value += result;
            block.value += "\n";
          }
        };
        prop.obj.connect(callback);
      } else {
        prop.obj.disconnect(function () {
          block.value += new Date().toLocaleString() + " - 信号订阅已取消！\n";
        });
      }
    },
    handleSolt: function (prop) {
      // 槽函数的调用
      const funcName = prop.name.substring(0, prop.name.indexOf("("));
      let paramsInput = document.getElementsByName("param-" + funcName);
      let args = [];
      paramsInput.forEach(function (elem) {
        args.push(elem.value);
      });
      let callback = (result) => {
        console.log(prop);
        prop.lastCallTime = new Date().toLocaleString();
        let resultTxt =
            typeof result !== "string" ? JSON.stringify(result, null, 4) : result;
        let block = document.getElementById("txt-" + this.qtobject.__id__ + '_' + funcName);
        block.innerHTML = resultTxt;
        hljs.highlightBlock(block);
      };
      args.push(callback);
      prop.obj.apply(this.qtobject, args);
    },
  },
};
</script>
