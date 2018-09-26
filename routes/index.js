var express = require('express');
// const url = require('url');
const {appId,appSecret} = require('../wechat/config');
const wxapi = require('../wechat/index')(appId, appSecret);

var router = express.Router();

/* GET home page. */
router.get('/', async function (ctx, next) {

  var access = await wxapi.getAccessToken();
  console.log(`access-token:${access}`);

  var jstoken = await wxapi.getJsapiTicket();
  console.log(`js-token:${jstoken}`);

  var hrefUrl = ctx.protocol + '://' + ctx.get('host') + ctx.originalUrl;
  // var hrefUrl = 'https://' + ctx.get('host') + ctx.originalUrl;
  console.log('----------hrefUrl-------------', hrefUrl);

  var signature = await wxapi.createSignature(hrefUrl);
  console.log(`signature:${JSON.stringify(signature) }`);

  var authUrl = wxapi.createAuthUrl(hrefUrl)
  console.log(`authUrl:${authUrl}`);

  var title = '睡觉是这个世界上最幸福的事情';
  var desc = '睡觉是这个世界上最幸福的事情，没有之一，累了，困了，就找个地方好好休息。心，也是一样一样的。所以，我也躺床上，睡着了。没有做梦，连白日梦都没有！';
  var imgUrl = `${ctx.protocol}://${ctx.get('host')}/images/mi.JPG`
  // console.log(`---------------${title}----------------------`,imgUrl,desc);

  await ctx.res.render('index', {
    // result: results[0][0],
    // islogin: ctx.session.user_id,
    // menuid: 1,
    title: title,
    desc: desc,
    imgUrl: imgUrl,
    appId: signature.appid,
    timestamp: signature.timestamp,
    nonceStr: signature.noncestr,
    signature: signature.signature
  })

  // res.render('index', { title: 'Express' });
});

module.exports = router;