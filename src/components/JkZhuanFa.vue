<template>
    <div></div>
</template>

<script>
import { QWebChannel } from "qwebchannel";

export default {
    name: 'ZhuanFaComponent',
    data() {
        return {
            wsUrl: 'ws://localhost:7000/webchannel',  // WebSocket服务器地址
            qtObjs: null,                             // QtWebchannel的对象，如果为null说明还未初始化
            linkList: new Map(),                      // 要绑定到链路列表的链路对象数组
            recvAddrList: new Map(),                  // 收地址列表
            linkForm: {}                              // 绑定到添加/编辑链路信息上的表单对象
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // 初始化webchannel的连接，为后续功能做好准备
            let ws = new WebSocket(wsUrl);
            let self = this;
            ws.onopen = function() {
                new QWebChannel(ws, function(channel) {
                    // 先将channel的对象赋值给本组件的qtObjs，方便以后其他方法来调用。
                    self.qtObjs = channel.objects;
                    // 开始加载列表
                    self.linkList = self.qtObjs.jkzfService.linkList;
                    // 加载收地址列表
                    self.recvAddrList = self.qtObjs.jkzfService.sendAddrList;
                    // TODO:收地址列表最好是一个map类型，或者后端直接能组织成如下类型的JSON
                    /*
                    [
                        {"recvIp": "126.255.1.12", "recvType": "组播", "recvPort": 3444, "recvSource": "126.255.2.34", "deviceName": "XXX", "sendAddrList": [
                            {"targetIp": "126.244.2.23", "sendType": "组播", "targetPort": 3444, "deviceName": "xxx"},
                            {"targetIp": "126.244.2.28", "sendType": "组播", "targetPort": 344, "deviceName": "xsw"}
                        ]},
                        {"recvIp": "126.255.1.15", "recvType": "组播", "recvPort": 1334, "recvSource": "126.255.2.34", "deviceName": "XXX", "sendAddrList": []}
                    ]
                    */
                });
            }
        },
        initLinkForm() {
            this.linkForm = {"id": this.linkList.size(),
                             "name": "",
                             "ss": ""};
            // TODO：把这些对应的属性补充完整，除了第一项序号是现有链路列表最大序号+1外，其他值都置为空
        },
        addLink() {
            // 点击添加链路的操作，先将linkForm初始化成空白
            this.initLinkForm();
            // TODO：弹出添加对话框
            // Dialog.open();
        },
        editLink(link) {
            this.linkForm.id = link.id;
            this.linkForm.name = link.name;
            // TODO: 继续赋值
            // Dialog.open();
        },
        saveLinkForm() {
            //TODO:调用后端函数添加一条链路，后端返回是否成功的QString(成功返回'ok'，否则返回错误原因描述)
            // 可以设置一个变量来判断是添加还是修改
            if (!this.qtObjs) return;  //webchannel未初始化时不能调用
            this.qtObjs.jkzfService.addLink(linkForm, function(result) {
                if (result === 'ok') {
                    // TODO: 回调函数中，根据该是否成功，将这条数据 append 到现有的 linkList 中
                    // Dialog.close();
                    this.initLinkForm();
                } else {
                    alert(result);
                }
            });
        }
        // TODO: 其他需要的方法
    },
}
</script>