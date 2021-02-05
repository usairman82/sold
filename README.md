# sold

Authentication:

The main JWT Authentication Endpoint is: GET /api/auth
When attempting authentication you will need to pass your <email> and <password>
separated by a colon and base64 encoded in your Authorization header as follows.

user@domain.com:password

base64(user@domain.com:password) = dXNlckBkb21haW4uY29tOnBhc3N3b3Jk

curl -X GET "https://sold.theirishgeek.io/api/auth" -H"Authorization: Basic dXNlckBkb21haW4uY29tOnBhc3N3b3Jk"

You will receive a response similar to this:
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6MjMsIm5hbWUiOiJMYXJob25kYSBIb3ZpcyIsInN1cGVyQWRtaW4iOjEsInNob3BOYW1lIjoibGFyaG9uZGFob3Zpc2JvdXRpcXVlIiwidXNlckF1dGhlbnRpY2F0ZWQiOjF9LCJpYXQiOjE2MTI1MTUwNjksImV4cCI6MTYxMjUxODY2OX0.vNje6lAxcSwNZI2XBhn27ToqufFUJPbGntNKMB50Z-0"}

{
  "alg": "HS256",
  "typ": "JWT"
}
.
{
  "data": {
    "userId": 1,
    "name": "Test User",
    "superAdmin": 1,
    "shopName": "testshop",
    "userAuthenticated": 1
  },
  "iat": 1612515069,
  "exp": 1612518669
}
.
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  <secret>)
