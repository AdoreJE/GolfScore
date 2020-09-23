const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
// const bcrypt = require('bcrypt-nodejs');
// var MySQLStore = require('express-mysql-session')(session);
var FileStore = require('session-file-store')(session);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

let app = express();
app.use(bodyParser.json());

let network = require('./network.js');
// CORS 설정
app.use(
  cors({
    origin: 'http://localhost:3000',
    // origin: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);

// session
app.use(
  session({
    secret: 'dkaeifs',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.get('/api/queryallground', async function (req, res) {
  try {
    const [contract, gateway] = await network.getReservationNetwork();
    const result = await contract.evaluateTransaction('queryAllGround');
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );

    // console.log(result);
    res.status(200).json({ response: result.toString() });
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    // process.exit(1);
  }
});

app.get('/api/query/:ground_ID', async function (req, res) {
  try {
    const [contract, gateway] = await network.getReservationNetwork();
    // Evaluate the specified transaction.
    // queryGround transaction - requires 1 argument, ex: ('queryGround', 'Ground01')
    // queryAllGround transaction - requires no arguments, ex: ('queryAllGround')
    const result = await contract.evaluateTransaction(
      'queryGround',
      req.params.ground_ID
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.status(200).json({ response: result.toString() });
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    // process.exit(1);
  }
});

app.post('/api/createGround/', async function (req, res) {
  try {
    const [contract, gateway] = await network.getReservationNetwork();
    // Submit the specified transaction.
    await contract.submitTransaction(
      'createGround',
      req.body.groundID,
      req.body.groundName,
      req.body.availableTimeStart,
      req.body.availableTimeEnd,
      req.body.totalHole
    );
    console.log('Transaction has been submitted');
    res.send('Transaction has been submitted');
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    // process.exit(1);
  }
});

app.post('/api/reserveGround/', async function (req, res) {
  try {
    const [contract, gateway] = await network.getReservationNetwork();
    contract.addContractListener(listener);

    // Submit the specified transaction.
    await contract.submitTransaction(
      'reserveGround',
      req.body.groundID,
      req.body.userID,
      req.body.begin,
      req.body.end
    );
    console.log('Transaction has been submitted');
    res.send('Transaction has been submitted');
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    // process.exit(1);
  }
});

app.get('/api/confirmReservation/:groundID/:userID', async function (req, res) {
  try {
    const [contract, gateway] = await network.getReservationNetwork();
    // Evaluate the specified transaction.
    // queryGround transaction - requires 1 argument, ex: ('queryGround', 'Ground01')
    // queryAllGround transaction - requires no arguments, ex: ('queryAllGround')
    const result = await contract.evaluateTransaction(
      'confirmReservation',
      req.params.groundID,
      req.params.userID
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.status(200).json({ response: result.toString() });
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
    // process.exit(1);
  }
});

// var options = {
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'dkanrjsk',
//   database: 'login',
// };

// var sessionStore = new MySQLStore(options);

// login
app.post('/api/login', async (req, res) => {
  try {
    const [contract, gateway] = await network.getUserNetwork();

    const result = await contract.evaluateTransaction(
      'queryUser',
      req.body.userID
    );
    var resultJSON = JSON.parse(result);
    console.log(resultJSON.userPWD);

    // Load hash from your password DB.
    bcrypt.compare(req.body.userPWD, resultJSON.userPWD, function (
      err,
      result
    ) {
      // result == true
      if (result) {
        console.log(
          `Transaction has been evaluated, result is: ${result.toString()}`
        );
        let token = jwt.sign(
          {
            isLoggedIn: true,
            userName: resultJSON.userName,
          },
          'secret',
          {
            expiresIn: '5m', // 유효 시간은 5분
          }
        );

        res.cookie('user', token, {
          expires: new Date(Date.now() + 900000),
          sameSite: 'lax',
          secure: true,
          httpOnly: true,
        });
        res.status(200).json({ response: 'success', token: token });
      } else {
        console.log(`invalid user info`);
        res.status(200).json({ response: 'invalid' });
      }
    });

    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    // status code : 500
    res.status(200).json({ response: error.toString() });
    // process.exit(1);
  }
  // const body = req.body; // body-parser 사용
  // // console.log(req);
  // if (findUser(body.userID, body.userPWD)) {
  //   // 해당유저가 존재한다면
  //   req.session.user_uid = findUserIndex(body.userID, body.userPWD); //유니크한 값 유저 색인 값 저장

  //   // res.redirect('/');
  //   res.send('ok');
  // } else {
  //   res.send('유효하지 않습니다.');
  // }
});

app.get('/api/logout', (req, res) => {
  delete req.session.user_uid;
  res.redirect('/');
});

app.post('/api/signup', async (req, res) => {
  try {
    const [contract, gateway] = await network.getUserNetwork();
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(req.body.userPWD, salt, async function (err, hash) {
        // Store hash in your password DB.
        // Submit the specified transaction.
        await contract.submitTransaction(
          'signUp',
          req.body.userID,
          hash,
          req.body.userNickname
        );
      });
    });

    console.log('Transaction has been submitted');
    res.status(200).json({ response: 'signUp' });
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    res.status(200).json({ response: `${req.body.userID} already exist` });
  }

  // if (!findUser(body.userID, body.userPWD)) {
  //   // 아이디도 중복안되게 분기 해야는데 예제이므로..
  //   const salt = bcrypt.genSaltSync(10); // salt값 생성, 10이 default
  //   const hash = bcrypt.hashSync(body.userPWD, salt); // Digest
  //   users.push({
  //     userID: body.userID,
  //     userPWD: hash,
  //     userNickname: body.userNickname,
  //   });
  //   // res.redirect('/login');
  //   res.send('ok');
  // }
});

const users = [
  {
    userID: 'admin',
    userNickname: 'admin',
    userPWD: 'a',
  },
];
const findUser = (_userID, _userPWD) => {
  // id와 password가 일치하는 유저 찾는 함수, 없으면 undefined 반환
  return users.find(
    (v) => v.userID === _userID && bcrypt.compareSync(_userPWD, v.userPWD)
  );
};
const findUserIndex = (_userID, _userPWD) => {
  // 일치하는 유저의 index값(유니크) 반환
  return users.findIndex(
    (v) => v.userID === _userID && bcrypt.compareSync(_userPWD, v.userPWD)
  );
};

app.listen(8080);

// // 나중에 쓸 수 도?
let details = '';
const listener = async (event) => {
  if (event.eventName === 'newReservation') {
    console.log('\n\nnewReservation');
    details = event.payload.toString('utf8');
    // Run business process to handle orders
    console.log('===============');
    console.log(details);
  }
};

// app.get('/api/events', async function (req, res) {
//   console.log('request received');
//   res.writeHead(200, {
//     Connection: 'keep-alive',
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//   });
//   res.write('\n');
//   setInterval(() => {
//     res.write('event: reservation\n'); // added these
//     res.write(`data: ${JSON.stringify(details)}`);
//     res.write('\n\n');
//   }, 5000);
// });
