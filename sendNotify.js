/*
 * @Author: lxk0301 https://gitee.com/lxk0301
 * @Date: 2020-08-19 16:12:40
 * @Last Modified by: whyour
 * @Last Modified time: 2021-5-1 15:00:54
 * sendNotify 推送通知功能
 * @param text 通知头
 * @param desp 通知体
 * @param params 某些推送通知方式点击弹窗可跳转, 例：{ url: 'https://abc.com' }
 * @param author 作者仓库等信息  例：`本通知 By：https://github.com/whyour/qinglong`
 */
//详细说明参考 https://github.com/ccwav/QLScript2.
const querystring = require('querystring');
const exec = require('child_process').exec;
const $ = new Env();
const timeout = 15000; //超时时间(单位毫秒)

// =======================================go-cqhttp通知设置区域===========================================
//gobot_url 填写请求地址http://127.0.0.1/send_private_msg
//gobot_token 填写在go-cqhttp文件设置的访问密钥
//gobot_qq 填写推送到个人QQ或者QQ群号
//go-cqhttp相关API https://docs.go-cqhttp.org/api
let GOBOT_URL = ''; // 推送到个人QQ: http://127.0.0.1/send_private_msg  群：http://127.0.0.1/send_group_msg
let GOBOT_TOKEN = ''; //访问密钥
let GOBOT_QQ = ''; // 如果GOBOT_URL设置 /send_private_msg 则需要填入 user_id=个人QQ 相反如果是 /send_group_msg 则需要填入 group_id=QQ群

// =======================================微信server酱通知设置区域===========================================
//此处填你申请的SCKEY.
//(环境变量名 PUSH_KEY)
let SCKEY = '';

// =======================================Bark App通知设置区域===========================================
//此处填你BarkAPP的信息(IP/设备码，例如：https://api.day.app/XXXXXXXX)
let BARK_PUSH = '';
//BARK app推送铃声,铃声列表去APP查看复制填写
let BARK_SOUND = '';
//BARK app推送消息的分组, 默认为"QingLong"
let BARK_GROUP = 'QingLong';

// =======================================telegram机器人通知设置区域===========================================
//此处填你telegram bot 的Token，telegram机器人通知推送必填项.例如：1077xxx4424:AAFjv0FcqxxxxxxgEMGfi22B4yh15R5uw
//(环境变量名 TG_BOT_TOKEN)
let TG_BOT_TOKEN = '';
//此处填你接收通知消息的telegram用户的id，telegram机器人通知推送必填项.例如：129xxx206
//(环境变量名 TG_USER_ID)
let TG_USER_ID = '';
//tg推送HTTP代理设置(不懂可忽略,telegram机器人通知推送功能中非必填)
let TG_PROXY_HOST = ''; //例如:127.0.0.1(环境变量名:TG_PROXY_HOST)
let TG_PROXY_PORT = ''; //例如:1080(环境变量名:TG_PROXY_PORT)
let TG_PROXY_AUTH = ''; //tg代理配置认证参数
//Telegram api自建的反向代理地址(不懂可忽略,telegram机器人通知推送功能中非必填),默认tg官方api(环境变量名:TG_API_HOST)
let TG_API_HOST = 'api.telegram.org';
// =======================================钉钉机器人通知设置区域===========================================
//此处填你钉钉 bot 的webhook，例如：5a544165465465645d0f31dca676e7bd07415asdasd
//(环境变量名 DD_BOT_TOKEN)
let DD_BOT_TOKEN = '';
//密钥，机器人安全设置页面，加签一栏下面显示的SEC开头的字符串
let DD_BOT_SECRET = '';

// =======================================企业微信机器人通知设置区域===========================================
//此处填你企业微信机器人的 webhook(详见文档 https://work.weixin.qq.com/api/doc/90000/90136/91770)，例如：693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa
//(环境变量名 QYWX_KEY)
let QYWX_KEY = '';

// =======================================企业微信应用消息通知设置区域===========================================
/*
此处填你企业微信应用消息的值(详见文档 https://work.weixin.qq.com/api/doc/90000/90135/90236)
环境变量名 QYWX_AM依次填入 corpid,corpsecret,touser(注:多个成员ID使用|隔开),agentid,消息类型(选填,不填默认文本消息类型)
注意用,号隔开(英文输入法的逗号)，例如：wwcff56746d9adwers,B-791548lnzXBE6_BWfxdf3kSTMJr9vFEPKAbh6WERQ,mingcheng,1000001,2COXgjH2UIfERF2zxrtUOKgQ9XklUqMdGSWLBoW_lSDAdafat
可选推送消息类型(推荐使用图文消息（mpnews）):
- 文本卡片消息: 0 (数字零)
- 文本消息: 1 (数字一)
- 图文消息（mpnews）: 素材库图片id, 可查看此教程(http://note.youdao.com/s/HMiudGkb)或者(https://note.youdao.com/ynoteshare1/index.html?id=1a0c8aff284ad28cbd011b29b3ad0191&type=note)
 */
let QYWX_AM = '';

// =======================================iGot聚合推送通知设置区域===========================================
//此处填您iGot的信息(推送key，例如：https://push.hellyw.com/XXXXXXXX)
let IGOT_PUSH_KEY = '';

// =======================================push+设置区域=======================================
//官方文档：http://www.pushplus.plus/
//PUSH_PLUS_TOKEN：微信扫码登录后一对一推送或一对多推送下面的token(您的Token)，不提供PUSH_PLUS_USER则默认为一对一推送
//PUSH_PLUS_USER： 一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码，如果您是创建群组人。也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送）
let PUSH_PLUS_TOKEN = '';
let PUSH_PLUS_USER = '';
let PUSH_PLUS_TOKEN_hxtrip = '';
let PUSH_PLUS_USER_hxtrip = '';

// ======================================= WxPusher 通知设置区域 ===========================================
// 此处填你申请的 appToken. 官方文档：https://wxpusher.zjiecode.com/docs
// WP_APP_TOKEN 可在管理台查看: https://wxpusher.zjiecode.com/admin/main/app/appToken
// WP_TOPICIDS 群发, 发送目标的 topicId, 以 ; 分隔! 使用 WP_UIDS 单发的时候, 可以不传
// WP_UIDS 发送目标的 uid, 以 ; 分隔。注意 WP_UIDS 和 WP_TOPICIDS 可以同时填写, 也可以只填写一个。
// WP_URL 原文链接, 可选参数
let WP_APP_TOKEN = "";
let WP_TOPICIDS = "";
let WP_UIDS = "";
let WP_URL = "";

let WP_APP_TOKEN_ONE = "";
let WP_UIDS_ONE = "";

// =======================================gotify通知设置区域==============================================
//gotify_url 填写gotify地址,如https://push.example.de:8080
//gotify_token 填写gotify的消息应用token
//gotify_priority 填写推送消息优先级,默认为0
let GOTIFY_URL = '';
let GOTIFY_TOKEN = '';
let GOTIFY_PRIORITY = 0;

/**
 * sendNotify 推送通知功能
 * @param text 通知头
 * @param desp 通知体
 * @param params 某些推送通知方式点击弹窗可跳转, 例：{ url: 'https://abc.com' }
 * @param author 作者仓库等信息  例：`本通知 By：https://github.com/whyour/qinglong`
 * @returns {Promise<unknown>}
 */
let PushErrorTime = 0;
let strTitle = "";
let ShowRemarkType = "1";
let Notify_NoCKFalse = "false";
let Notify_NoLoginSuccess = "false";
let UseGroupNotify = 1;
let strAuthor = "";
const {
    getEnvs
} = require('./ql');
const fs = require('fs');
let strCKFile = '/ql/scripts/CKName_cache.json';
let Fileexists = fs.existsSync(strCKFile);
let TempCK = [];
if (Fileexists) {
    console.log("加载sendNotify,检测到别名缓存文件，载入...");
    TempCK = fs.readFileSync(strCKFile, 'utf-8');
    if (TempCK) {
        TempCK = TempCK.toString();
        TempCK = JSON.parse(TempCK);
    }
}
let strUidFile = './CK_WxPusherUid.json';
let UidFileexists = fs.existsSync(strUidFile);
let TempCKUid = [];
if (UidFileexists) {
    console.log("检测到WxPusherUid文件，载入...");
    TempCKUid = fs.readFileSync(strUidFile, 'utf-8');
    if (TempCKUid) {
        TempCKUid = TempCKUid.toString();
        TempCKUid = JSON.parse(TempCKUid);
    }
}

let tempAddCK = {};
let boolneedUpdate = false;
let strCustom = "";
let strCustomArr = [];
let strCustomTempArr = [];
let Notify_CKTask = "";
let Notify_SkipText = [];
async function sendNotify(text, desp, params = {}, author = '\n\n本通知 By ccwav Mod') {
    console.log(`开始发送通知...`);
    try {
        //Reset 变量
        console.log("通知标题: " + text);
        UseGroupNotify = 1;
        strTitle = "";
        GOBOT_URL = '';
        GOBOT_TOKEN = '';
        GOBOT_QQ = '';
        SCKEY = '';
        BARK_PUSH = '';
        BARK_SOUND = '';
        BARK_GROUP = 'QingLong';
        TG_BOT_TOKEN = '';
        TG_USER_ID = '';
        TG_PROXY_HOST = '';
        TG_PROXY_PORT = '';
        TG_PROXY_AUTH = '';
        TG_API_HOST = 'api.telegram.org';
        DD_BOT_TOKEN = '';
        DD_BOT_SECRET = '';
        QYWX_KEY = '';
        QYWX_AM = '';
        IGOT_PUSH_KEY = '';
        PUSH_PLUS_TOKEN = '';
        PUSH_PLUS_USER = '';
        PUSH_PLUS_TOKEN_hxtrip = '';
        PUSH_PLUS_USER_hxtrip = '';
        Notify_CKTask = "";
        Notify_SkipText = [];

        //变量开关
        var Use_serverNotify = true;
        var Use_pushPlusNotify = true;
        var Use_BarkNotify = true;
        var Use_tgBotNotify = true;
        var Use_ddBotNotify = true;
        var Use_qywxBotNotify = true;
        var Use_qywxamNotify = true;
        var Use_iGotNotify = true;
        var Use_gobotNotify = true;
        var Use_pushPlushxtripNotify = true;
        var Use_WxPusher = true;

        if (process.env.NOTIFY_NOCKFALSE) {
            Notify_NoCKFalse = process.env.NOTIFY_NOCKFALSE;
        }
        strAuthor = "";
        if (process.env.NOTIFY_AUTHOR) {
            strAuthor = process.env.NOTIFY_AUTHOR;
        }
        if (process.env.NOTIFY_SHOWNAMETYPE) {
            ShowRemarkType = process.env.NOTIFY_SHOWNAMETYPE;
        }
        if (process.env.NOTIFY_NOLOGINSUCCESS) {
            Notify_NoLoginSuccess = process.env.NOTIFY_NOLOGINSUCCESS;
        }
        if (process.env.NOTIFY_CKTASK) {
            Notify_CKTask = process.env.NOTIFY_CKTASK;
        }

        if (process.env.NOTIFY_SKIP_TEXT && desp) {
            Notify_SkipText = process.env.NOTIFY_SKIP_TEXT.split('&');
            if (Notify_SkipText.length > 0) {
                for (var Templ in Notify_SkipText) {
                    if (desp.indexOf(Notify_SkipText[Templ]) != -1) {
                        console.log("检测内容到内容存在屏蔽推送的关键字(" + Notify_SkipText[Templ] + ")，将跳过推送...");
                        return;
                    }
                }
            }
        }

        if (text.indexOf("cookie已失效") != -1 || desp.indexOf("重新登录获取") != -1 || text == "Ninja 运行通知") {

            if (Notify_CKTask) {
                console.log("触发CK脚本，开始执行....");
                Notify_CKTask = "task " + Notify_CKTask + " now";
                await exec(Notify_CKTask, function (error, stdout, stderr) {
                    console.log(error, stdout, stderr)
                });
            }
            if (Notify_NoCKFalse == "true" && text != "Ninja 运行通知") {
                return;
            }
        }

        //检查黑名单屏蔽通知
        const notifySkipList = process.env.NOTIFY_SKIP_LIST ? process.env.NOTIFY_SKIP_LIST.split('&') : [];
        let titleIndex = notifySkipList.findIndex((item) => item === text);

        if (titleIndex !== -1) {
            console.log(`${text} 在推送黑名单中，已跳过推送`);
            return;
        }

        if (text.indexOf("已可领取") != -1) {
            if (text.indexOf("农场") != -1) {
                strTitle = "东东农场领取";
            } else {
                strTitle = "东东萌宠领取";
            }
        }
        if (text.indexOf("汪汪乐园养joy") != -1) {
            strTitle = "汪汪乐园养joy领取";
        }

        if (text == "京喜工厂") {
            if (desp.indexOf("元造进行兑换") != -1) {
                strTitle = "京喜工厂领取";
            }
        }

        if (text.indexOf("任务") != -1 && (text.indexOf("新增") != -1 || text.indexOf("删除") != -1)) {
            strTitle = "脚本任务更新";
        }
        if (strTitle) {
            const notifyRemindList = process.env.NOTIFY_NOREMIND ? process.env.NOTIFY_NOREMIND.split('&') : [];
            titleIndex = notifyRemindList.findIndex((item) => item === strTitle);

            if (titleIndex !== -1) {
                console.log(`${text} 在领取信息黑名单中，已跳过推送`);
                return;
            }

        } else {
            strTitle = text;
        }

        if (Notify_NoLoginSuccess == "true") {
            if (desp.indexOf("登陆成功") != -1) {
                console.log(`登陆成功不推送`);
                return;
            }
        }

        //检查脚本名称是否需要通知到Group2,Group2读取原环境配置的变量名后加2的值.例如: QYWX_AM2
        const notifyGroup2List = process.env.NOTIFY_GROUP2_LIST ? process.env.NOTIFY_GROUP2_LIST.split('&') : [];
        const titleIndex2 = notifyGroup2List.findIndex((item) => item === strTitle);
        const notifyGroup3List = process.env.NOTIFY_GROUP3_LIST ? process.env.NOTIFY_GROUP3_LIST.split('&') : [];
        const titleIndexGp3 = notifyGroup3List.findIndex((item) => item === strTitle);
        const notifyGroup4List = process.env.NOTIFY_GROUP4_LIST ? process.env.NOTIFY_GROUP4_LIST.split('&') : [];
        const titleIndexGp4 = notifyGroup4List.findIndex((item) => item === strTitle);
        const notifyGroup5List = process.env.NOTIFY_GROUP5_LIST ? process.env.NOTIFY_GROUP5_LIST.split('&') : [];
        const titleIndexGp5 = notifyGroup5List.findIndex((item) => item === strTitle);
        const notifyGroup6List = process.env.NOTIFY_GROUP6_LIST ? process.env.NOTIFY_GROUP6_LIST.split('&') : [];
        const titleIndexGp6 = notifyGroup6List.findIndex((item) => item === strTitle);

        if (titleIndex2 !== -1) {
            console.log(`${strTitle} 在群组2推送名单中，初始化群组推送`);
            UseGroupNotify = 2;
        }
        if (titleIndexGp3 !== -1) {
            console.log(`${strTitle} 在群组3推送名单中，初始化群组推送`);
            UseGroupNotify = 3;
        }
        if (titleIndexGp4 !== -1) {
            console.log(`${strTitle} 在群组4推送名单中，初始化群组推送`);
            UseGroupNotify = 4;
        }
        if (titleIndexGp5 !== -1) {
            console.log(`${strTitle} 在群组5推送名单中，初始化群组推送`);
            UseGroupNotify = 5;
        }
        if (titleIndexGp6 !== -1) {
            console.log(`${strTitle} 在群组6推送名单中，初始化群组推送`);
            UseGroupNotify = 6;
        }
        if (process.env.NOTIFY_CUSTOMNOTIFY) {
            strCustom = process.env.NOTIFY_CUSTOMNOTIFY;
        }
        if (strCustom) {
            strCustomArr = strCustom.replace(/^\[|\]$/g, "").split(",");
            strCustomTempArr = [];
            for (var Tempj in strCustomArr) {
                strCustomTempArr = strCustomArr[Tempj].split("&");
                if (strCustomTempArr.length > 1) {
                    if (strTitle == strCustomTempArr[0]) {
                        console.log("检测到自定义设定,开始执行配置...");
                        if (strCustomTempArr[1] == "组1") {
                            console.log("自定义设定强制使用组1配置通知...");
                            UseGroupNotify = 1;
                        }
                        if (strCustomTempArr[1] == "组2") {
                            console.log("自定义设定强制使用组2配置通知...");
                            UseGroupNotify = 2;
                        }
                        if (strCustomTempArr[1] == "组3") {
                            console.log("自定义设定强制使用组3配置通知...");
                            UseGroupNotify = 3;
                        }
                        if (strCustomTempArr[1] == "组4") {
                            console.log("自定义设定强制使用组4配置通知...");
                            UseGroupNotify = 4;
                        }
                        if (strCustomTempArr[1] == "组5") {
                            console.log("自定义设定强制使用组5配置通知...");
                            UseGroupNotify = 5;
                        }
                        if (strCustomTempArr[1] == "组6") {
                            console.log("自定义设定强制使用组6配置通知...");
                            UseGroupNotify = 6;
                        }

                        if (strCustomTempArr.length > 2) {
                            console.log("关闭所有通知变量...");
                            Use_serverNotify = false;
                            Use_pushPlusNotify = false;
                            Use_pushPlushxtripNotify = false;
                            Use_BarkNotify = false;
                            Use_tgBotNotify = false;
                            Use_ddBotNotify = false;
                            Use_qywxBotNotify = false;
                            Use_qywxamNotify = false;
                            Use_iGotNotify = false;
                            Use_gobotNotify = false;

                            for (let Tempk = 2; Tempk < strCustomTempArr.length; Tempk++) {
                                var strTrmp = strCustomTempArr[Tempk];
                                switch (strTrmp) {
                                case "Server酱":
                                    Use_serverNotify = true;
                                    console.log("自定义设定启用Server酱进行通知...");
                                    break;
                                case "pushplus":
                                    Use_pushPlusNotify = true;
                                    console.log("自定义设定启用pushplus(推送加)进行通知...");
                                    break;
                                case "pushplushxtrip":
                                    Use_pushPlushxtripNotify = true;
                                    console.log("自定义设定启用pushplus_hxtrip(推送加)进行通知...");
                                    break