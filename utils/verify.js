/**
 * 作者：Bulu
 * 创建时间：2020-09-01
 * 描述：校验工具类
 */

/**
 * 判断是否为空
 * @param {校验值}} val
 */
exports.IsEmpty = (val) => {
    // console.log(typeof val)
    if (val === null || val === undefined) {
        return true;
    } else {
        if (typeof val === "string") {
            if (val === "" || val === "null" || val === "undefined") {
                return true;
            } else {
                return false;
            }
        } else if (typeof val === "number") {
            if (isNaN(val)) {
                return true;
            } else {
                return false;
            }
        } else if (typeof val === "object") {
            if (
                (Array.isArray(val) && val.length === 0) ||
                Object.keys(val).length === 0
            ) {
                return true;
            } else {
                return false;
            }
        }
    }
}

/**
 * 判断是否为空，为空返回指定默认值
 * @param {Object} val 校验对象
 * @param {Object} rtVal 默认值
 */
exports.EmptyDefault = (val, rtVal) => {
    // console.log(typeof val)
    if (val === null || val === undefined) {
        return rtVal;
    } else {
        if (typeof val === "string") {
            if (val === "" || val === "null" || val === "undefined") {
                return rtVal;
            } else {
                return val;
            }
        } else if (typeof val === "number") {
            if (isNaN(val)) {
                return rtVal;
            } else {
                return val;
            }
        } else if (typeof val === "object") {
            if (
                (Array.isArray(val) && val.length === 0) ||
                Object.keys(val).length === 0
            ) {
                return rtVal;
            } else {
                return val;
            }
        }
    }
}

/**
 * 获取url参数
 * @param {String} _url
 * @param {String} _prop
 */
exports.GetUrlParams = (_url, _prop) => {
    let params = {},
        query = _url, // location.search.substring(1),
        arr = query.split("&"),
        rt;
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i],
            tmp = item.split("="),
            key = tmp[0],
            val = tmp[1];
        if (typeof params[key] == "undefined") {
            params[key] = val;
        } else if (typeof params[key] == "string") {
            params[key] = [params[key], val];
        } else {
            params[key].push(val);
        }
    }
    rt = _prop ? params[_prop] : params;
    return rt;
}

/**
 * 手机号码有效性验证
 * @param {String} _mobile 待校验手机号码
 */
exports.CheckMobile = (_mobile) => {
    if (this.IsEmpty(_mobile)) {
        return false;
    }
    var reg = /^1[1-9][0-9]\d{8}$/g;
    return reg.test(_mobile);
}

/**
 * 隐藏手机中间四位
 * @param {String}} _mobile 待隐藏的手机号码
 */
exports.HideMobile = (_mobile) => {
    if (this.IsEmpty(_mobile)) {
        return _mobile;
    }
    var reg = /^(\d{3})\d{4}(\d{4})$/g;
    return _mobile.replace(reg, "$1****$2");
}

/**
 * 隐藏用户名
 * @param {String} _userName 用户姓名
 */
exports.HideUserName = (_userName) => {
    if (this.IsEmpty(_userName)) {
        return _userName;
    }
    var newStr;
    if (_userName.length === 2) {
        newStr = _userName.substr(0, 1) + "*";
    } else if (_userName.length > 2) {
        var char = "";
        var _length = _userName.length > 4 ? 4 : _userName.length;
        for (let i = 0, len = _length - 2; i < len; i++) {
            char += "*";
        }
        newStr = _userName.substr(0, 1) + char + _userName.substr(-1, 1);
    }
    return newStr;
}

/**
 * 给隐私信息标记号加密
 * @param {String} personInfo 需要加密的信息
 * @param {*} left 左侧保留原字符串位数 默认为2
 * @param {*} right 右侧保留原字符串位数 默认为2
 * @param {*} replace 加密符 默认：’*’
 */
exports.SecretInfo = (personInfo, left = 2, right = 2, replace = "*") => {
    if (typeof personInfo === "number") {
        personInfo = "" + personInfo;
    }
    if (typeof personInfo !== "string") {
        throw new Error("参数类型错误");
    }
    if (personInfo.length < 7) {
        throw new Error("参数长度需要大于7");
    }
    let reg = new RegExp(
        "^([a-zA-Z\\d]{" + left + "})([a-zA-Z\\d]+)([a-zA-Z\\d]{" + right + "})$"
    );
    return personInfo.replace(reg, function(x, y, z, p) {
        let i = "";
        while (i.length < z.length) {
            i += replace;
        }
        return y + i + p;
    });
}

/**
 * 数字校验
 * @param {Number} _number 待校验数字
 */
exports.CheckNumber = (_number) => {
    var a = /^(-?\d+)(\.\d+)?$/;
    if (this.IsEmpty(_number)) {
        return false;
    } else {
        if (a.test(_number)) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * 指定区间随机数
 * @param {*} _min 最小数字
 * @param {*} _max 最大数字
 */
exports.GetRandomNum = (_min, _max) => {
    var Range = _max - _min;
    var Rand = Math.random();
    return _min + Math.round(Rand * Range);
}

/**
 * 校验字符串是否以指定字符串开头
 * @param {String} _content 待核验内容
 * @param {String} _prefix 前缀
 */
exports.StartWith = (_content, _prefix) => {
    var reg = new RegExp("^" + _prefix);
    return reg.test(_content);
}

/**
 * 校验字符串是否以指定字符串结束
 * @param {String} _content 待核验内容
 * @param {String} _suffix 前缀
 */
exports.EndWith = (_content, _suffix) => {
    var reg = new RegExp(_suffix + "$");
    return reg.test(_content);
}

/**
 * 数组数据分割
 * @param {Array} _data 数组
 * @param {Number} _num 每组数据条数
 */
exports.ArrayDataSplitg = (_data, _num) => {
    var proportion = _num;
    var num = 0;
    var data = [];
    for (var i = 0; i < _data.length; i++) {
        if (i % proportion === 0 && i !== 0) {
            data.push(_data.slice(num, i));
            num = i;
        }
        if (i + 1 === _data.length) {
            data.push(_data.slice(num, i + 1));
        }
    }
    return data;
}

/**
 * 是否为苹果手机
 */
exports.IsIOS = () => {
    let u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
}

/**
 * 是否为安卓手机
 */
exports.IsAndroid = () => {
    let u = navigator.userAgent;
    return u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
}

/**
 * 判断是否为PC端
 */
exports.IsPc = () => {
    let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return !flag;
}

/**
 * 是否为微信内置浏览器
 * @return {Boolean}
 */
exports.IsWeChat = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

/**
 * 日期格式化
 * @param {Date} _date 日期
 * @param {String} _format 格式 'yyyy-MM-dd HH:mm:ss'
 */
exports.DateFormat = (_date, _format) => {
    if (this.IsEmpty(_date)) {
        return _date;
    }
    // if (Ios()) {
    //   // eslint-disable-next-line no-useless-escape
    //   // var arr = _date.split(/[- : \/]/) // 字符串分割返回一个数组
    //   // console.log(arr)
    //   // eslint-disable-next-line no-useless-escape
    //   _date = _date.replace(/\-/g, '/')
    //   // _date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
    //   console.info(_date)
    // }
    var _line = true;
    var _point = true;
    if (_date.indexOf("-") === -1) {
        _line = false;
    } else if (_date.indexOf(".") === -1) {
        _point = false;
    }
    // eslint-disable-next-line no-useless-escape
    _date = _date.replace(/\-/g, "/");
    _date = new Date(_date);
    _format = _format || "yyyy-MM-dd hh:mm:ss";

    if (_date instanceof Date) {
        // eslint-disable-next-line no-extend-native
        Date.prototype.Format = function(fmt) {
            // author: meizz
            var o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                S: this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length)
                );
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length === 1 ?
                        o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length)
                    );
            }
            return fmt;
        };
        if (_line) {
            return _date
                .Format(_format)
                .replace(/\//g, "-")
                .replace(/\./g, "-");
        } else if (_point) {
            return _date.Format(_format).replace(/\//g, ".");
        }
        return _date.Format(_format);
    }
    return _date;
}

/**
 * 字符串校验
 * @param {String} _str 待校验对象
 */
exports.IsString = (_str) => {
    return Object.prototype.toString.call(_str) === "[object String]";
}

/**
 * 判断字符串是否为有效的JSON格式
 * @param {String} _jsonStr json字符串
 */
exports.IsJSON = (_jsonStr) => {
    // 正则表达式校验字符串是否为有效的json格式
    if (!IsString(_jsonStr)) return false;
    // 替换回车符、换行符、空格等特殊标记
    _jsonStr = _jsonStr.replace(/\s/g, "").replace(/\n|\r/, "");
    //
    if (/^\{(.*?)\}$/.test(_jsonStr)) {
        return /"(.*?)":(.*?)/g.test(_jsonStr);
    }
    if (/^\[(.*?)\]$/.test(_jsonStr)) {
        return _jsonStr
            .replace(/^\[/, "")
            .replace(/\]$/, "")
            .replace(/},{/g, "}\n{")
            .split(/\n/)
            .map(function(s) {
                return IsJSON(s);
            })
            .reduce(function(prev, curr) {
                return !!curr;
            });
    }
    return false;
}

/**
 * 判断是否为身份证号
 * @param {String} str 待校验的身份证号码
 * @return {Boolean}
 */
exports.IsIdCard = (str) => {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
        str
    );
}

/**
 * 判断是否为URL地址
 * @param {String} _url 网址
 * @return {Boolean}
 */
exports.IsUrl = (_url) => {
    return /[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/i.test(
        _url
    );
}

/**
 * 千位分割方法
 * @param {String,Number} num 待分割金额
 * @param {Number} n 小数点后保留几位数
 * @param {String} symbol 分隔符
 */
exports.PriceSubstr = (num = "0", n = 0, symbol = ",") => {
    if (parseInt(num) != num && n !== 0) {
        if (symbol === ".") throw new Error("symbol can not same as .");
    }
    num = (+num).toFixed(n === 0 ? 1 : n);
    num = num.toString().replace(/(\d)(?=(\d{3})+\.)/g, `$1${symbol}`);
    if (n) {
        return num;
    } else {
        return num.substring(0, num.lastIndexOf("."));
    }
}

/**
 * 通过图片类型输出后缀名
 * @param {String} mimeType 图片类型
 */
exports.ImageSuffixByMimeType = (mimeType) => {
    if (this.IsEmpty(mimeType)) {
        return '';
    } else {
        let _suffix = '';
        switch (mimeType) {
            case 'image/bmp':
                _suffix = '.bmp';
                break;
            case 'image/cis-cod':
                _suffix = '.cod';
                break;
            case 'image/gif':
                _suffix = '.gif';
                break;
            case 'image/ief':
                _suffix = '.ief';
                break;
            case 'image/jpeg':
                _suffix = '.jpg';
                break;
            case 'image/pipeg':
                _suffix = '.jfif';
                break;
            case 'image/svg+xml':
                _suffix = '.svg';
                break;
            case 'image/tiff':
                _suffix = '.tiff';
                break;
            case 'image/x-icon':
                _suffix = '.ico';
                break;
            case 'image/x-rgb':
                _suffix = '.rgb';
                break;
            case 'image/png':
                _suffix = '.png';
                break;
            case 'image/x-targa':
                _suffix = '.tga';
                break;
            case 'image/vnd.adobe.photoshop':
                _suffix = '.jpg';
                break;
            default:
                _suffix = '';
                break;
        }
        return _suffix;
    }
}