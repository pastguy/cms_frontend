let imgUrlScience = location.host.match(/ump-[a-z]+\./g);
imgUrlScience = imgUrlScience && imgUrlScience.length ? imgUrlScience[0].replace('ump-', '').replace('.', '') : (/localhost/g).test(location.host) ? 'localhost' : 0;
module.exports = {

  imgUrl: `${location.protocol}//${imgUrlScience === 0 ? 'prod-' : imgUrlScience == 'localhost' ? 'dev-' : imgUrlScience + '-'}oyo-common-file-r.oss-cn-beijing.aliyuncs.com`,              // 图片环境
  moduleA: '/ump-discount-web',
  moduleB: '/ump-platform-web',
  moduleC: '/ump-member-web',
  homePath: '/homepage',
  // localHost: 'http://47.75.193.12/cms',
  localHost: 'http://127.0.0.1:5000',
}
