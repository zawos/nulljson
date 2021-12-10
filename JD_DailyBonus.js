/*************************

京东多合一签到脚本

更新时间: 2021.09.09 20:20 v2.1.3
有效接口: 20+
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
电报频道: @NobyDa 
问题反馈: @NobyDa_bot 
如果转载: 请注明出处

*************************
【 QX, Surge, Loon 说明 】 :
*************************

初次使用时, app配置文件添加脚本配置, 并启用Mitm后:

Safari浏览器打开登录 https://home.m.jd.com/myJd/newhome.action 点击"我的"页面
或者使用旧版网址 https://bean.m.jd.com/bean/signIndex.action 点击签到并且出现签到日历
如果通知获取Cookie成功, 则可以使用此签到脚本. 注: 请勿在京东APP内获取!!!

获取京东金融签到Body说明: 正确添加脚本配置后, 进入"京东金融"APP, 在"首页"点击"签到"并签到一次, 待通知提示成功即可.

由于cookie的有效性(经测试网页Cookie有效周期最长31天)，如果脚本后续弹出cookie无效的通知，则需要重复上述步骤。 
签到脚本将在每天的凌晨0:05执行, 您可以修改执行时间。 因部分接口京豆限量领取, 建议调整为凌晨签到。

BoxJs或QX Gallery订阅地址: https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json

*************************
【 配置多京东账号签到说明 】 : 
*************************

正确配置QX、Surge、Loon后, 并使用此脚本获取"账号1"Cookie成功后, 请勿点击退出账号(可能会导致Cookie失效), 需清除浏览器资料或更换浏览器登录"账号2"获取即可; 账号3或以上同理.
注: 如需清除所有Cookie, 您可开启脚本内"DeleteCookie"选项 (第114行)

*************************
【 JSbox, Node.js 说明 】 :
*************************

开启抓包app后, Safari浏览器登录 https://home.m.jd.com/myJd/newhome.action 点击个人中心页面后, 返回抓包app搜索关键字 info/GetJDUserInfoUnion 复制请求头Cookie字段填入json串数据内即可

如需获取京东金融签到Body, 可进入"京东金融"APP (iOS), 在"首页"点击"签到"并签到一次, 返回抓包app搜索关键字 h5/m/appSign 复制请求体填入json串数据内即可
*/

var Key = ''; //该参数已废弃; 仅用于下游脚本的兼容, 请使用json串数据 ↓

var DualKey = ''; //该参数已废弃; 仅用于下游脚本的兼容, 请使用json串数据  ↓

var OtherKey = ``; //无限账号Cookie json串数据, 请严格按照json格式填写, 具体格式请看以下样例:

/*以下样例为双账号("cookie"为必须,其他可选), 第一个账号仅包含Cookie, 第二个账号包含Cookie和金融签到Body: 

var OtherKey = `[{
  "cookie": "pt_key=xxx;pt_pin=yyy;"
}, {
  "cookie": "pt_key=yyy;pt_pin=xxx;",
  "jrBody": "reqData=xxx"
}]`

   注1: 以上选项仅针对于JsBox或Node.js, 如果使用QX,Surge,Loon, 请使用脚本获取Cookie.
   注2: 多账号用户抓取"账号1"Cookie后, 请勿点击退出账号(可能会导致Cookie失效), 需清除浏览器资料或更换浏览器登录"账号2"抓取.
   注3: 如果使用Node.js, 需自行安装'request'模块. 例: npm install request -g
   注4: Node.js或JSbox环境下已配置数据持久化, 填写Cookie运行一次后, 后续更新脚本无需再次填写, 待Cookie失效后重新抓取填写即可.
   注5: 脚本将自动处理"持久化数据"和"手动填写cookie"之间的重复关系, 例如填写多个账号Cookie后, 后续其中一个失效, 仅需填写该失效账号的新Cookie即可, 其他账号不会被清除.

*************************
【Surge 4.2+ 脚本配置】:
*************************

[Script]
京东多合一签到 = type=cron,cronexp=5 0 * * *,wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

获取京东Cookie = type=http-request,requires-body=1,pattern=^https:\/\/(api\.m|me-api|ms\.jr)\.jd\.com\/(client\.action\?functionId=signBean|user_new\/info\/GetJDUserInfoUnion\?|gw\/generic\/hy\/h5\/m\/appSign\?),script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

[MITM]
hostname = ms.jr.jd.com, me-api.jd.com, api.m.jd.com

*************************
【Loon 2.1+ 脚本配置】:
*************************

[Script]
cron "5 0 * * *" tag=京东多合一签到, script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

http-request ^https:\/\/(api\.m|me-api|ms\.jr)\.jd\.com\/(client\.action\?functionId=signBean|user_new\/info\/GetJDUserInfoUnion\?|gw\/generic\/hy\/h5\/m\/appSign\?) tag=获取京东Cookie, requires-body=true, script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

[MITM]
hostname = ms.jr.jd.com, me-api.jd.com, api.m.jd.com

*************************
【 QX 1.0.10+ 脚本配置 】 :
*************************

[task_local]
# 京东多合一签到
5 0 * * * https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js, tag=京东多合一签到, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/jd.png,enabled=true

[rewrite_local]
# 获取京东Cookie. 
^https:\/\/(api\.m|me-api)\.jd\.com\/(client\.action\?functionId=signBean|user_new\/info\/GetJDUserInfoUnion\?) url script-request-header https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

# 获取钢镚签到body. 
^https:\/\/ms\.jr\.jd\.com\/gw\/generic\/hy\/h5\/m\/appSign\? url script-request-body https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

[mitm]
hostname = ms.jr.jd.com, me-api.jd.com, api.m.jd.com

*************************/

var LogDetails = false; //是否开启响应日志, true则开启

var stop = '0'; //自定义延迟签到, 单位毫秒. 默认分批并发无延迟; 该参数接受随机或指定延迟(例: '2000'则表示延迟2秒; '2000-5000'则表示延迟最小2秒,最大5秒内的随机延迟), 如填入延迟则切换顺序签到(耗时较长), Surge用户请注意在SurgeUI界面调整脚本超时; 注: 该参数Node.js或JSbox环境下已配置数据持久化, 留空(var stop = '')即可清除.

var DeleteCookie = false; //是否清除所有Cookie, true则开启.

var boxdis = true; //是否开启自动禁用, false则关闭. 脚本运行崩溃时(如VPN断连), 下次运行时将自动禁用相关崩溃接口(仅部分接口启用), 崩溃时可能会误禁用正常接口. (该选项仅适用于QX,Surge,Loon)

var ReDis = false; //是否移除所有禁用列表, true则开启. 适用于触发自动禁用后, 需要再次启用接口的情况. (该选项仅适用于QX,Surge,Loon)

var out = 0; //接口超时退出, 用于可能发生的网络不稳定, 0则关闭. 如QX日志出现大量"JS Context timeout"后脚本中断时, 建议填写6000

var $nobyda = nobyda();

var merge = {};

var KEY = '';

async function all(cookie, jrBody) {
  KEY = cookie;
  merge = {};
  $nobyda.num++;
  switch (stop) {
    case 0:
      await Promise.all([
        JingDongBean(stop), //京东京豆
        JingDongStore(stop), //京东超市
        JingRongSteel(stop, jrBody), //金融钢镚
        JingDongTurn(stop), //京东转盘
        JDFlashSale(stop), //京东闪购
        JingDongCash(stop), //京东现金红包
        JDMagicCube(stop, 2), //京东小魔方
        JingDongSubsidy(stop), //京东金贴
        JingDongGetCash(stop), //京东领现金
        JingDongShake(stop), //京东摇一摇
        JDSecKilling(stop), //京东秒杀
        // JingRongDoll(stop, 'JRDoll', '京东金融-签壹', '4D25A6F482'),
        // JingRongDoll(stop, 'JRThreeDoll', '京东金融-签叁', '69F5EC743C'),
        // JingRongDoll(stop, 'JRFourDoll', '京东金融-签肆', '30C4F86264'),
        // JingRongDoll(stop, 'JRFiveDoll', '京东金融-签伍', '1D06AA3B0F')
      ]);
      await Promise.all([
        JDUserSignPre(stop, 'JDUndies', '京东商城-内衣', '4PgpL1xqPSW1sVXCJ3xopDbB1f69'), //京东内衣馆
        JDUserSignPre(stop, 'JDCard', '京东商城-卡包', '7e5fRnma6RBATV9wNrGXJwihzcD'), //京东卡包
        // JDUserSignPre(stop, 'JDCustomized', '京东商城-定制', '2BJK5RBdvc3hdddZDS1Svd5Esj3R'), //京东定制
        JDUserSignPre(stop, 'JDaccompany', '京东商城-陪伴', 'kPM3Xedz1PBiGQjY4ZYGmeVvrts'), //京东陪伴
        JDUserSignPre(stop, 'JDShoes', '京东商城-鞋靴', '4RXyb1W4Y986LJW8ToqMK14BdTD'), //京东鞋靴
        JDUserSignPre(stop, 'JDChild', '京东商城-童装', '3Af6mZNcf5m795T8dtDVfDwWVNhJ'), //京东童装馆
        JDUserSignPre(stop, 'JDBaby', '京东商城-母婴', '3BbAVGQPDd6vTyHYjmAutXrKAos6'), //京东母婴馆
        JDUserSignPre(stop, 'JD3C', '京东商城-数码', '4SWjnZSCTHPYjE5T7j35rxxuMTb6'), //京东数码电器馆
        JDUserSignPre(stop, 'JDWomen', '京东商城-女装', 'DpSh7ma8JV7QAxSE2gJNro8Q2h9'), //京东女装馆
        JDUserSignPre(stop, 'JDBook', '京东商城-图书', '3SC6rw5iBg66qrXPGmZMqFDwcyXi'), //京东图书
        // JDUserSignPre(stop, 'ReceiveJD', '京东商城-领豆', 'Ni5PUSK7fzZc4EKangHhqPuprn2'), //京东-领京豆
        JingRongDoll(stop, 'JTDouble', '京东金贴-双签', '1DF13833F7'), //京东金融 金贴双签
        // JingRongDoll(stop, 'XJDouble', '金融现金-双签', 'F68B2C3E71', '', '', '', 'xianjin') //京东金融 现金双签
      ]);
      await Promise.all([
        JDUserSignPre(stop, 'JDStory', '京东失眠-补贴', 'UcyW9Znv3xeyixW1gofhW2DAoz4'), //失眠补贴
        JDUserSignPre(stop, 'JDPhone', '京东手机-小时', '4Vh5ybVr98nfJgros5GwvXbmTUpg'), //手机小时达
        JDUserSignPre(stop, 'JDEsports', '京东商城-电竞', 'CHdHQhA5AYDXXQN9FLt3QUAPRsB'), //京东电竞
        JDUserSignPre(stop, 'JDClothing', '京东商城-服饰', '4RBT3H9jmgYg1k2kBnHF8NAHm7m8'), //京东服饰
        JDUserSignPre(stop, 'JDSuitcase', '京东商城-箱包', 'ZrH7gGAcEkY2gH8wXqyAPoQgk6t'), //京东箱包馆
        JDUserSignPre(stop, 'JDSchool', '京东商城-校园', '2QUxWHx5BSCNtnBDjtt5gZTq7zdZ'), //京东校园
        JDUserSignPre(stop, 'JDHealth', '京东商城-健康', 'w2oeK5yLdHqHvwef7SMMy4PL8LF'), //京东健康
        JDUserSignPre(stop, 'JDShand', '京东拍拍-二手', '3S28janPLYmtFxypu37AYAGgivfp'), //京东拍拍二手
        JDUserSignPre(stop, 'JDClean', '京东商城-清洁', '2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6'), //京东清洁馆
        JDUserSignPre(stop, 'JDCare', '京东商城-个护', '2tZssTgnQsiUqhmg5ooLSHY9XSeN'), //京东个人护理馆
        JDUserSignPre(stop, 'JDJiaDian', '京东商城-家电', '3uvPyw1pwHARGgndatCXddLNUxHw'), // 京东小家电
        // JDUserSignPre(stop, 'JDJewels', '京东商城-珠宝', 'zHUHpTHNTaztSRfNBFNVZscyFZU'), //京东珠宝馆
        // JDUserSignPre(stop, 'JDMakeup', '京东商城-美妆', '2smCxzLNuam5L14zNJHYu43ovbAP'), //京东美妆馆
        JDUserSignPre(stop, 'JDVege', '京东商城-菜场', 'Wcu2LVCFMkBP3HraRvb7pgSpt64'), //京东菜场
        // JDUserSignPre(stop, 'JDLive', '京东智能-生活', 'KcfFqWvhb5hHtaQkS4SD1UU6RcQ') //京东智能生活
      ]);
      await JingRongDoll(stop, 'JDDouble', '金融京豆-双签', 'F68B2C3E71', '', '', '', 'jingdou'); //京东金融 京豆双签
      break;
    default:
      await JingDongBean(0); //京东京豆
      await JingDongStore(Wait(stop)); //京东超市
      await JingRongSteel(Wait(stop), jrBody); //金融钢镚
      await JingDongTurn(Wait(stop)); //京东转盘
      await JDFlashSale(Wait(stop)); //京东闪购
      await JingDongCash(Wait(stop)); //京东现金红包
      await JDMagicCube(Wait(stop), 2); //京东小魔方
      await JingDongGetCash(Wait(stop)); //京东领现金
      await JingDongSubsidy(Wait(stop)); //京东金贴
      await JingDongShake(Wait(stop)); //京东摇一摇
      await JDSecKilling(Wait(stop)); //京东秒杀
      // await JingRongDoll(Wait(stop), 'JRThreeDoll', '京东金融-签叁', '69F5EC743C');
      // await JingRongDoll(Wait(stop), 'JRFourDoll', '京东金融-签肆', '30C4F86264');
      // await JingRongDoll(Wait(stop), 'JRFiveDoll', '京东金融-签伍', '1D06AA3B0F');
      // await JingRongDoll(Wait(stop), 'JRDoll', '京东金融-签壹', '4D25A6F482');
      // await JingRongDoll(Wait(stop), 'XJDouble', '金融现金-双签', 'F68B2C3E71', '', '', '', 'xianjin'); //京东金融 现金双签
      await JingRongDoll(Wait(stop), 'JTDouble', '京东金贴-双签', '1DF13833F7'); //京东金融 金贴双签
      await JDUserSignPre(Wait(stop), 'JDStory', '京东失眠-补贴', 'UcyW9Znv3xeyixW1gofhW2DAoz4'); //失眠补贴
      await JDUserSignPre(Wait(stop), 'JDPhone', '京东手机-小时', '4Vh5ybVr98nfJgros5GwvXbmTUpg'); //手机小时达
      await JDUserSignPre(Wait(stop), 'JDCard', '京东商城-卡包', '7e5fRnma6RBATV9wNrGXJwihzcD'); //京东卡包
      await JDUserSignPre(Wait(stop), 'JDUndies', '京东商城-内衣', '4PgpL1xqPSW1sVXCJ3xopDbB1f69'); //京东内衣馆
      await JDUserSignPre(Wait(stop), 'JDEsports', '京东商城-电竞', 'CHdHQhA5AYDXXQN9FLt3QUAPRsB'); //京东电竞
      // await JDUserSignPre(Wait(stop), 'JDCustomized', '京东商城-定制', '2BJK5RBdvc3hdddZDS1Svd5Esj3R'); //京东定制
      await JDUserSignPre(Wait(stop), 'JDSuitcase', '京东商城-箱包', 'ZrH7gGAcEkY2gH8wXqyAPoQgk6t'); //京东箱包馆
      await JDUserSignPre(Wait(stop), 'JDClothing', '京东商城-服饰', '4RBT3H9jmgYg1k2kBnHF8NAHm7m8'); //京东服饰
      await JDUserSignPre(Wait(stop), 'JDSchool', '京东商城-校园', '2QUxWHx5BSCNtnBDjtt5gZTq7zdZ'); //京东校园 
      await JDUserSignPre(Wait(stop), 'JDHealth', '京东商城-健康', 'w2oeK5yLdHqHvwef7SMMy4PL8LF'); //京东健康
      await JDUserSignPre(Wait(stop), 'JDShoes', '京东商城-鞋靴', '4RXyb1W4Y986LJW8ToqMK14BdTD'); //京东鞋靴
      await JDUserSignPre(Wait(stop), 'JDChild', '京东商城-童装', '3Af6mZNcf5m795T8dtDVfDwWVNhJ'); //京东童装馆
      await JDUserSignPre(Wait(stop), 'JDBaby', '京东商城-母婴', '3BbAVGQPDd6vTyHYjmAutXrKAos6'); //京东母婴馆
      await JDUserSignPre(Wait(stop), 'JD3C', '京东商城-数码', '4SWjnZSCTHPYjE5T7j35rxxuMTb6'); //京东数码电器馆
      await JDUserSignPre(Wait(stop), 'JDWomen', '京东商城-女装', 'DpSh7ma8JV7QAxSE2gJNro8Q2h9'); //京东女装馆
      await JDUserSignPre(Wait(stop), 'JDBook', '京东商城-图书', '3SC6rw5iBg66qrXPGmZMqFDwcyXi'); //京东图书
      await JDUserSignPre(Wait(stop), 'JDShand', '京东拍拍-二手', '3S28janPLYmtFxypu37AYAGgivfp'); //京东拍拍二手
      // await JDUserSignPre(Wait(stop), 'JDMakeup', '京东商城-美妆', '2smCxzLNuam5L14zNJHYu43ovbAP'); //京东美妆馆
      await JDUserSignPre(Wait(stop), 'JDVege', '京东商城-菜场', 'Wcu2LVCFMkBP3HraRvb7pgSpt64'); //京东菜场
      await JDUserSignPre(Wait(stop), 'JDaccompany', '京东商城-陪伴', 'kPM3Xedz1PBiGQjY4ZYGmeVvrts'); //京东陪伴
      // await JDUserSignPre(Wait(stop), 'JDLive', '京东智能-生活', 'KcfFqWvhb5hHtaQkS4SD1UU6RcQ'); //京东智能生活
      await JDUserSignPre(Wait(stop), 'JDClean', '京东商城-清洁', '2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6'); //京东清洁馆
      await JDUserSignPre(Wait(stop), 'JDCare', '京东商城-个护', '2tZssTgnQsiUqhmg5ooLSHY9XSeN'); //京东个人护理馆
      await JDUserSignPre(Wait(stop), 'JDJiaDian', '京东商城-家电', '3uvPyw1pwHARGgndatCXddLNUxHw'); // 京东小家电馆
      // await JDUserSignPre(Wait(stop), 'ReceiveJD', '京东商城-领豆', 'Ni5PUSK7fzZc4EKangHhqPuprn2'); //京东-领京豆
      // await JDUserSignPre(Wait(stop), 'JDJewels', '京东商城-珠宝', 'zHUHpTHNTaztSRfNBFNVZscyFZU'); //京东珠宝馆
      await JingRongDoll(Wait(stop), 'JDDouble', '金融京豆-双签', 'F68B2C3E71', '', '', '', 'jingdou'); //京东金融 京豆双签
      break;
  }
  await Promise.all([
    TotalSteel(), //总钢镚查询
    TotalCash(), //总红包查询
    TotalBean(), //总京豆查询
    TotalSubsidy(), //总金贴查询
    TotalMoney() //总现金查询
  ]);
  await notify(); //通知模块
}

function notify() {
  return new Promise(resolve => {
    try {
      var bean = 0;
      var steel = 0;
      var cash = 0;
      var money = 0;
      var subsidy = 0;
      var success = 0;
      var fail = 0;
      var err = 0;
      var notify = '';
      for (var i in merge) {
        bean += merge[i].bean ? Number(merge[i].bean) : 0
        steel += merge[i].steel ? Number(merge[i].steel) : 0
        cash += merge[i].Cash ? Number(merge[i].Cash) : 0
        money += merge[i].Money ? Number(merge[i].Money) : 0
        subsidy += merge[i].subsidy ? Number(merge[i].subsidy) : 0
        success += merge[i].success ? Number(merge[i].success) : 0
        fail += merge[i].fail ? Number(merge[i].fail) : 0
        err += merge[i].error ? Number(merge[i].error) : 0
        notify += merge[i].notify ? "\n" + merge[i].notify : ""
      }
      var Cash = merge.TotalCash && merge.TotalCash.TCash ? `${merge.TotalCash.TCash}红包` : ""
      var Steel = merge.TotalSteel && merge.TotalSteel.TSteel ? `${merge.TotalSteel.TSteel}钢镚` : ``
      var beans = merge.TotalBean && merge.TotalBean.Qbear ? `${merge.TotalBean.Qbear}京豆${Steel?`, `:``}` : ""
      var Money = merge.TotalMoney && merge.TotalMoney.TMoney ? `${merge.TotalMoney.TMoney}现金${Cash?`, `:``}` : ""
      var Subsidy = merge.TotalSubsidy && merge.TotalSubsidy.TSubsidy ? `${merge.TotalSubsidy.TSubsidy}金贴${Money||Cash?", ":""}` : ""
      var Tbean = bean ? `${bean.toFixed(0)}京豆${steel?", ":""}` : ""
      var TSteel = steel ? `${steel.toFixed(2)}钢镚` : ""
      var TCash = cash ? `${cash.toFixed(2)}红包${subsidy||money?", ":""}` : ""
      var TSubsidy = subsidy ? `${subsidy.toFixed(2)}金贴${money?", ":""}` : ""
      var TMoney = money ? `${money.toFixed(2)}现金` : ""
      var Ts = success ? `成功${success}个${fail||err?`, `:``}` : ``
      var Tf = fail ? `失败${fail}个${err?`, `:``}` : ``
      var Te = err ? `错误${err}个` : ``
      var one = `【签到概览】:  ${Ts+Tf+Te}${Ts||Tf||Te?`\n`:`获取失败\n`}`
      var two = Tbean || TSteel ? `【签到奖励】:  ${Tbean+TSteel}\n` : ``
      var three = TCash || TSubsidy || TMoney ? `【其他奖励】:  ${TCash+TSubsidy+TMoney}\n` : ``
      var four = `【账号总计】:  ${beans+Steel}${beans||Steel?`\n`:`获取失败\n`}`
      var five = `【其他总计】:  ${Subsidy+Money+Cash}${Subsidy||Money||Cash?`\n`:`获取失败\n`}`
      var DName = merge.TotalBean && merge.TotalBean.nickname ? merge.TotalBean.nickname : "获取失败"
      var cnNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
      const Name = DualKey || OtherKey.length > 1 ? `【签到号${cnNum[$nobyda.num]||$nobyda.num}】:  ${DName}\n` : ``
      const disables = $nobyda.read("JD_DailyBonusDisables")
      const amount = disables ? disables.split(",").length : 0
      const disa = !notify || amount ? `【温馨提示】:  检测到${$nobyda.disable?`上次执行意外崩溃, `:``}已禁用${notify?`${amount}个`:`所有`}接口, 如需开启请前往BoxJs或查看脚本内第118行注释.\n` : ``
      $nobyda.notify("", "", Name + one + two + three + four + five + disa + notify, {
        'media-url': $nobyda.headUrl || 'https://cdn.jsdelivr.net/gh/NobyDa/mini@master/Color/jd.png'
      });
      $nobyda.headUrl = null;
      if ($nobyda.isJSBox) {
        $nobyda.st = (typeof($nobyda.st) == 'undefined' ? '' : $nobyda.st) + Name + one + two + three + four + five + "\n"
      }
    } catch (eor) {
      $nobyda.notify("通知模块 " + eor.name + "‼️", JSON.stringify(eor), eor.message)
    } finally {
      resolve()
    }
  });
}

(async function ReadCookie() {
  const EnvInfo = $nobyda.isJSBox ? "JD_Cookie" : "CookieJD";
  const EnvInfo2 = $nobyda.isJSBox ? "JD_Cookie2" : "CookieJD2";
  const EnvInfo3 = $nobyda.isJSBox ? "JD_Cookies" : "CookiesJD";
  const move = CookieMove($nobyda.read(EnvInfo) || Key, $nobyda.read(EnvInfo2) || DualKey, EnvInfo, EnvInfo2, EnvInfo3);
  const cookieSet = $nobyda.read(EnvInfo3);
  if (DeleteCookie) {
    const write = $nobyda.write("", EnvInfo3);
    throw new Error(`Cookie清除${write?`成功`:`失败`}, 请手动关闭脚本内"DeleteCookie"选项`);
  } else if ($nobyda.isRequest) {
    GetCookie()
  } else if (Key || DualKey || (OtherKey || cookieSet || '[]') != '[]') {
    if (($nobyda.isJSBox || $nobyda.isNode) && stop !== '0') $nobyda.write(stop, "JD_DailyBonusDelay");
    out = parseInt($nobyda.read("JD_DailyBonusTimeOut")) || out;
    stop = Wait($nobyda.read("JD_DailyBonusDelay"), true) || Wait(stop, true);
    boxdis = $nobyda.read("JD_Crash_disable") === "false" || $nobyda.isNode || $nobyda.isJSBox ? false : boxdis;
    LogDetails = $nobyda.read("JD_DailyBonusLog") === "true" || LogDetails;
    ReDis = ReDis ? $nobyda.write("",