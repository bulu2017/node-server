# JWT

> JSON Web Tokens



### JWT 的三个部分依次如下

> - Header（头部）
>
>   Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子
>
>   ```json
>   {
>     "alg": "HS256",
>     "typ": "JWT"
>   }
>   ```
>
>   `alg`属性表示签名的算法（algorithm），默认是 HMAC SHA256（写成 HS256）；`typ`属性表示这个令牌（token）的类型（type），JWT 令牌统一写为`JWT`
>
>   最后，将上面的 JSON 对象使用 Base64URL 算法（详见后文）转成字符串
>
>   
>
> - Payload（负载）
>
>   Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了7个官方字段，供选用
>
>   > ```
>   > iss(issuer): 签发人
>   > exp (expiration time): 过期时间
>   > sub (subject): 主题
>   > aud (audience): 受众
>   > nbf (Not Before): 生效时间
>   > iat (Issued At): 签发时间
>   > jti (JWT ID): 编号
>   > ```
>   >
>   > 
>
>   除了官方字段，你还可以在这个部分定义私有字段，下面就是一个例子
>
>   ```json
>   {
>     "sub": "1234567890",
>     "name": "John Doe",
>     "admin": true
>   }
>   ```
>
>   ##### 注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分
>
>   
>
> - Signature（签名）
>
>   Signature 部分是对前两部分的签名，防止数据篡改
>
>   首先，需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名
>
>   ```
>   HMACSHA256(
>     base64UrlEncode(header) + "." +
>     base64UrlEncode(payload),
>     secret)
>   ```
>
>   算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（`.`）分隔，就可以返回给用户
>
> - Base64URL
>
>   前面提到，Header 和 Payload 串型化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但有一些小的不同。
>
>   JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，所以要被替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` 。这就是 Base64URL 算法。
>
> 写成一行，就是下面的样子
>
> - Header.Payload.Signature

### JWT 的几个特点

1. JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。
2. JWT 不加密的情况下，不能将秘密数据写入 JWT。
3. JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
4. JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
5. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
6. 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输



### node中使用JWT的API

> **jwt.sign(payload, secretOrPrivateKey, [options, callback])**
>
> **payload 参数**必须是一个object、Buffer、或 string.
> 注意：exp(过期时间) 只有当payload是object字面量时才可以设置。如果payload不是buffer或string，它会被强制转换为使用的字符串JSON.stringify()。
>
> **secretOrPrivateKey 参数** 是包含HMAC算法的密钥或RSA和ECDSA的PEM编码私钥的string或buffer。
>
> **options 参数有如下值：**
>
> ```
> algorithm：加密算法（默认值：HS256）
> expiresIn：以秒表示或描述时间跨度zeit / ms的字符串。如60，"2 days"，"10h"，"7d"，含义是：过期时间
> notBefore：以秒表示或描述时间跨度zeit / ms的字符串。如：60，"2days"，"10h"，"7d"
> audience：Audience，观众
> issuer：Issuer，发行者
> jwtid：JWT ID
> subject：Subject，主题
> noTimestamp
> header
> ```
>
> 该方法如果是异步方法，则会提供回调，如果是同步的话，则将会 JsonWebToken返回为字符串。
> 在expiresIn, notBefore, audience, subject, issuer没有默认值时，可以直接在payload中使用 exp, nbf, aud, sub 和 iss分别表示。
>
> **注意：**如果在jwts中没有指定 noTimestamp的话，在jwts中会包含一个iat，它的含义是使用它来代替实际的时间戳来计算的。
>
> 下面我们在项目中使用node中jsonwebtoken来生成一个JWT的demo了，在index.js 代码如下：
>
> ```javascript
> // 生成一个token
> const jwt = require('jsonwebtoken');
> 
> const secret = 'abcdef';
> 
> let token = jwt.sign({
>   name: 'kongzhi'
> }, secret, (err, token) => {
>   console.log(token);
> });
> ```
>
> 设置token的过期时间，比如设置token的有效期为1个小时，如下代码：
>
> ```javascript
> // 生成一个token
> const jwt = require('jsonwebtoken');
> 
> const secret = 'abcdef';
> // 设置token为一个小时有效期
> let token = jwt.sign({
>   name: 'kongzhi',
>   exp: Math.floor(Date.now() / 1000) + (60 * 60)
> }, secret, (err, token) => {
>   console.log(token);
> });
> ```
>
> 
>
> **jwt.verify(token, secretOrPrivateKey, [options, callback]) 验证token的合法性** 
>
> 比如上面生成的token设置为1个小时，生成的token为：
>
> ```
> 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia29uZ3poaSIsImlhdCI6MTU0Mzc2MjYzOSwiZXhwIjoxNTQzNzY2MjM5fQ.6idR7HPpjZIfZ_7j3B3eOnGzbvWouifvvJfeW46zuCw'
> ```
>
> 下面我们使用 jwt.verify来验证一下：
>
> ```javascript
> const jwt = require('jsonwebtoken');
> const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia29uZ3poaSIsImlhdCI6MTU0Mzc2MjYzOSwiZXhwIjoxNTQzNzY2MjM5fQ.6idR7HPpjZIfZ_7j3B3eOnGzbvWouifvvJfeW46zuCw';
> const secret = 'abcdef';
> jwt.verify(token, secret, (error, decoded) => {
>   if (error) {
>     console.log(error.message);
>   }
>   console.log(decoded);
> });
> 
> ```
>
> 执行node index.js 代码后，生成如下信息：
>
> ![img](https://img2018.cnblogs.com/blog/561794/201812/561794-20181209001750629-334298438.png)
>
> 现在我们再来生成一个token，假如该token的有效期为30秒，30秒后，我再使用刚刚生成的token，再去使用 verify去验证下，看是否能验证通过吗？(理论上token失效了，是不能验证通过的，但是我们还是来实践下)。如下代码：
>
> ```javascript
> // 生成一个token
> const jwt = require('jsonwebtoken');
> 
> const secret = 'abcdef';
> // 设置token为30秒的有效期
> let token = jwt.sign({
>   name: 'kongzhi',
>   exp: Math.floor(Date.now() / 1000) + 30
> }, secret, (err, token) => {
>   console.log(token);
> });
> ```
>
> 在命令行中生成 jwt为： 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia29uZ3poaSIsImV4cCI6MTU0Mzc2MzU1MywiaWF0IjoxNTQzNzYzNTIzfQ.79rH3h_ezayYBeNQ2Wj8fGK_wqsEqEPgRTG9uGmvD64';
>
> 然后我们现在使用该token去验证下，如下代码：
>
> ```javascript
> // 生成一个token
> const jwt = require('jsonwebtoken');
> 
> const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia29uZ3poaSIsImV4cCI6MTU0Mzc2MzU1MywiaWF0IjoxNTQzNzYzNTIzfQ.79rH3h_ezayYBeNQ2Wj8fGK_wqsEqEPgRTG9uGmvD64';
> const secret = 'abcdef';
> jwt.verify(token, secret, (error, decoded) => {
>   if (error) {
>     console.log(error.message);
>   }
>   console.log(decoded);
> });
> ```
>
> 执行命令，如下所示：
>
> ![img](https://img2018.cnblogs.com/blog/561794/201812/561794-20181209001857497-716887072.png)
>
> 如上可以看到token的有效期为30秒，30秒后再执行的话，就会提示jwt过期了
>
> 
>
>  **jwt.decode(token, [, options]) 返回解码没有验证签名是否有效的payload**

