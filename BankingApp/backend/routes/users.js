const express = require("express");
const Crypto = require("crypto");
const sha256 = require('js-sha256');
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const { Decimal128 } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

//create record gen salt
recordRoutes.route("/newuser").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { username: req.body.username };
    const accounts = await db_connect.collection("Accounts").find({}).toArray();
    const user = await db_connect.collection("Users").findOne(myquery);
    if(user){
      console.log("error: name taken");
      const result = {"signup": "duplicate"};
      res.json(result);
    } else {
      const db_connect = await dbo.getDb();
      const s = Crypto.randomBytes(16).toString("base64");
      const ph = sha256(req.body.password + s);
      const myobj = {
        username: req.body.username,
        salt: s,
        passhash: ph,
      };
      const response = await db_connect.collection("Users").insertOne(myobj);
      const result = {"signup": "success"}
      console.log("new user created: " + req.body.username);

      let i = 0;
      
      while (i < accounts.length) {
        let userAccount = {
          accountId: accounts[i]._id,
          username: myobj.username,
          amount: new Decimal128("0.0"),
        };
        console.log(userAccount);
        const response = await db_connect.collection("UserAccounts").insertOne(userAccount);
        i++
      }

      console.log(req.session);
      if (!req.session.username) {
        req.session.username = req.body.username;
        console.log("Session set");
      } else {
        console.log("Session already existed");
        req.session.username = req.body.username;
      }

      res.json(result);
    }
  } catch (err) {
    throw err;
  }
});

//login function
recordRoutes.route("/login").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { username: req.body.username };
    const user = await db_connect.collection("Users").findOne(myquery);
    let result;
    if (user) {
      const ph = sha256(req.body.password + user.salt);
      if (ph === user.passhash){
        result = { "login": "success" };
        console.log(req.session);
        if (!req.session.username) {
          req.session.username = req.body.username;
          console.log("Session set: " + req.session.username);
        } else {
          console.log("Session already existed");
          req.session.username = req.body.username;
        }
      } else {
        result = { "login": "password incorrect" };
      }
    } else {
      result = { "login": "user does not exist" };
    }
    console.log("Login attempt: " + req.body.username + ", " + result.login);

    res.json(result);
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/getUserInfo").get(async function (req, res) {
  try {
    if (!req.session.username) {
      console.log("No session found");
      const result = {username: null};
      res.json(result);
    } else {
      console.log("User is: " + req.session.username);
      const db_connect = await dbo.getDb();
      const myquery = { username: req.session.username };
      const user = await db_connect.collection("Users").findOne(myquery);

      const userAccounts = await db_connect.collection("UserAccounts").find(myquery).toArray();

      var savingBalance = 0;
      var checkingBalance = 0;
      var creditBalance = 0;

      userAccounts.forEach(account => {
        if (account.accountId == "65f3a8c6e7351c76396b5dce") { // Saving
          savingBalance = parseFloat(account.amount.toString());
        }
        else if (account.accountId == "65f3a92fe7351c76396b5dd0") { // Checking
          checkingBalance = parseFloat(account.amount.toString());
        }
        else if (account.accountId == "65f3a93de7351c76396b5dd1") { // Credit
          creditBalance = parseFloat(account.amount.toString());
        }
      });

      const result = {
        username: user.username,
        savingBalance: savingBalance,
        checkingBalance: checkingBalance,
        creditBalance: creditBalance,
      };
      res.json(result);
    }
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/transactionHistory/:accountid").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    let allTransactions
    if (req.params.accountid == 4) {
      // All transactions
      const myQuery = { username: req.session.username };
      allTransactions = await db_connect.collection("Transactions").find(myQuery).toArray();
      console.log(allTransactions);
      let counter = 0;
      while (counter < allTransactions.length) {
        if (allTransactions[counter].toAccountID == "65f3a8c6e7351c76396b5dce") {
          allTransactions[counter].toAccountID = "Saving";
        }
        else if (allTransactions[counter].toAccountID == "65f3a92fe7351c76396b5dd0") {
          allTransactions[counter].toAccountID = "Checking";
        }
        else if (allTransactions[counter].toAccountID == "65f3a93de7351c76396b5dd1") {
          allTransactions[counter].toAccountID = "Credit";
        }
        else {
          allTransactions[counter].toAccountID = "Withdrawal";
        }

        if (allTransactions[counter].fromAccountID == "65f3a8c6e7351c76396b5dce") {
          allTransactions[counter].fromAccountID = "Saving";
        }
        else if (allTransactions[counter].fromAccountID == "65f3a92fe7351c76396b5dd0") {
          allTransactions[counter].fromAccountID = "Checking";
        }
        else if (allTransactions[counter].fromAccountID == "65f3a93de7351c76396b5dd1") {
          allTransactions[counter].fromAccountID = "Credit";
        }
        else {
          allTransactions[counter].fromAccountID = "Deposit";
        }
        allTransactions[counter].transactionTotal = allTransactions[counter].transactionTotal.toString();
        allTransactions[counter].transactionDateTimeFormat = new Date(Date.parse(allTransactions[counter].transactionDateTime)).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"});
        allTransactions[counter].transactionDateTime = Date.parse(allTransactions[counter].transactionDateTime);
        counter += 1;
      }
      //res.json(allTransactions);
    }
    else {
      // Account specific transactions
      const depositQuery = { username: req.session.username,  toAccountID: req.params.accountid };
      console.log(depositQuery);
      const withdrawlQuery = { username: req.session.username,  fromAccountID: req.params.accountid };
      console.log(withdrawlQuery);
      //console.log(myquery);

      let deposits = await db_connect.collection("Transactions").find(depositQuery).toArray();
      console.log(deposits);
      let withdrawls = await db_connect.collection("Transactions").find(withdrawlQuery).toArray();
      console.log(withdrawls);
      console.log("---------------------------------------------------------")
      let counter = 0;
      while (counter < deposits.length) {
        if (deposits[counter].toAccountID == "65f3a8c6e7351c76396b5dce") {
          deposits[counter].toAccountID = "Saving";
        }
        else if (deposits[counter].toAccountID == "65f3a92fe7351c76396b5dd0") {
          deposits[counter].toAccountID = "Checking";
        }
        else if (deposits[counter].toAccountID == "65f3a93de7351c76396b5dd1") {
          deposits[counter].toAccountID = "Credit";
        }
        else {
          deposits[counter].toAccountID = "Withdrawal";
        }

        if (deposits[counter].fromAccountID == "65f3a8c6e7351c76396b5dce") {
          deposits[counter].fromAccountID = "Saving";
        }
        else if (deposits[counter].fromAccountID == "65f3a92fe7351c76396b5dd0") {
          deposits[counter].fromAccountID = "Checking";
        }
        else if (deposits[counter].fromAccountID == "65f3a93de7351c76396b5dd1") {
          deposits[counter].fromAccountID = "Credit";
        }
        else {
          deposits[counter].fromAccountID = "Deposit";
        }
        deposits[counter].transactionTotal = deposits[counter].transactionTotal.toString();
        deposits[counter].transactionDateTimeFormat = new Date(Date.parse(deposits[counter].transactionDateTime)).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"});
        deposits[counter].transactionDateTime = Date.parse(deposits[counter].transactionDateTime);
        counter += 1;
      }

      counter = 0;
      while (counter < withdrawls.length) {
        if (withdrawls[counter].toAccountID == "65f3a8c6e7351c76396b5dce") {
          withdrawls[counter].toAccountID = "Saving";
        }
        else if (withdrawls[counter].toAccountID == "65f3a92fe7351c76396b5dd0") {
          withdrawls[counter].toAccountID = "Checking";
        }
        else if (withdrawls[counter].toAccountID == "65f3a93de7351c76396b5dd1") {
          withdrawls[counter].toAccountID = "Credit";
        }
        else {
          withdrawls[counter].toAccountID = "Withdrawal";
        }

        if (withdrawls[counter].fromAccountID == "65f3a8c6e7351c76396b5dce") {
          withdrawls[counter].fromAccountID = "Saving";
        }
        else if (withdrawls[counter].fromAccountID == "65f3a92fe7351c76396b5dd0") {
          withdrawls[counter].fromAccountID = "Checking";
        }
        else if (withdrawls[counter].fromAccountID == "65f3a93de7351c76396b5dd1") {
          withdrawls[counter].fromAccountID = "Credit";
        }
        else {
          withdrawls[counter].fromAccountID = "Deposit";
        }
        withdrawls[counter].transactionTotal = "-" + withdrawls[counter].transactionTotal.toString();
        withdrawls[counter].transactionDateTimeFormat = new Date(Date.parse(withdrawls[counter].transactionDateTime)).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"});
        withdrawls[counter].transactionDateTime = Date.parse(withdrawls[counter].transactionDateTime);
        counter += 1;
      }
      //console.log(withdrawls.transactionAmount)
      //withdrawls.transactionAmount = -Math.abs(withdrawls.transactionAmount.parseFloat());
      console.log(withdrawls);
      console.log("---------------------------------------------------------")
      
      allTransactions = deposits.concat(withdrawls)
      console.log(allTransactions);
      //res.json(allTransactions);
    }
    //const db_connect = await dbo.getDb();
    //const myquery = { _id: new ObjectId(req.params.id) };
    //const result = await db_connect.collection("Users").findOne(myquery);
    //const result = withdrawls;
    //res.json(result);
    res.json(allTransactions);
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/logout").get(async function (req, res) {
  try {
    if (req.session.username) {
      req.session.destroy();
      console.log("logged out");
      res.json("{}");
    }
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/transactionRequests").post(async function(req,res){
  try {
    const db_connect = await dbo.getDb();

    const myquery = { username: req.body.name,  accountId: new ObjectId(req.body.accountType) };

    const user = await db_connect.collection("UserAccounts").findOne(myquery);

    console.log("this is the user information");

    console.log(user);

    var currentDate = new Date();

    if(user){
      if(req.body.method === "Deposit"){
          
        const amount = String(((parseFloat(user.amount)) + parseFloat(req.body.amount)));

        console.log("this is the amount being deposited " + parseFloat(req.body.amount));

        console.log("this is the amount before " + parseFloat(user.amount))

        console.log("this is the new amount " + amount);


        //values that go into the transactions table
        const myobj = {
          username: req.body.name,
          transactionTotal: new Decimal128(req.body.amount),
          transactionDateTime: currentDate,
          fromAccountID: "",
          toAccountID: req.body.accountType,
        };
            //value that goes into user accounts
        const newvalues = {
          $set: {
            amount: new Decimal128(amount),
          },
        };

        console.log(newvalues);
        
         //adding the values into their tables
        await db_connect.collection("UserAccounts").updateOne(myquery, newvalues);
        await db_connect.collection("Transactions").insertOne(myobj);
        res.json({value: 1});
      }
      else if(req.body.method === "Withdraw"){

        const amount = String(((parseFloat(user.amount)) - parseFloat(req.body.amount)));

        console.log("this is the amount being withdrawn " + parseFloat(req.body.amount));

        console.log("this is the amount before " + parseFloat(user.amount))

        console.log("this is the new amount " + amount);

        //values that go into the transactions table
        const myobj = {
          username: req.body.name,
          transactionTotal: new Decimal128(req.body.amount),
          transactionDateTime: currentDate,
          fromAccountID: req.body.accountType,
          toAccountID: "",
        };

        //value that goes into user accounts
        const newvalues = {
          $set: {
            amount: new Decimal128(amount),
          },
        };

        //adding the values into their tables
        await db_connect.collection("UserAccounts").updateOne(myquery, newvalues);
        
        await db_connect.collection("Transactions").insertOne(myobj);

        res.json({value: 1});
      }
    }
    else{
      //will say that no one has been found
      console.log("no one found");
      res.json({value : -1});
    }
  } catch (err) {
    throw err;
  }
})


recordRoutes.route("/getTransferInfo").get(async function (req, res) {
  try {
    if (!req.session.username) {
      console.log("No session found");
      const result = {username: null, accounts: {}};
      res.json(result);
    } else {
      console.log("User is: " + req.session.username);
      const db_connect = await dbo.getDb();
      const myquery = [
        {
          $lookup: {
            from: 'Accounts',
            localField: 'accountId',
            foreignField: '_id',
            as: 'accountname'
          }
        },
        {
          $match: { username: req.session.username }
        },
      ];
      const useraccounts = await db_connect.collection("UserAccounts").aggregate(myquery).toArray();


      let result = {
        username: req.session.username,
        accounts: []
      };
      
      useraccounts.forEach((i, j) => {
        result.accounts[j] = {
          accountname: i.accountname[0].Name,
          accountid: i.accountname[0]._id
        }
      });
      res.json(result);
    }
  } catch (err) {
    throw err;
  }
});


recordRoutes.route("/submitTransfer").post(async function (req, res) {
  try {
    console.log(req.body);
    const db_connect = await dbo.getDb();
    const myquery1 = { 
      accountId: new ObjectId(req.body.from),
      username: req.body.username
    };
    const faccount = await db_connect.collection("UserAccounts").findOne(myquery1);
    
    if((parseFloat(faccount.amount) * 100) - req.body.amount < 0){
      const result = {status: "error: source account does not have sufficient funds"};
      res.json(result);
    } else {
      const myquery2 = { 
        accountId: new ObjectId(req.body.to),
        username: req.body.username
      };
      const taccount = await db_connect.collection("UserAccounts").findOne(myquery2);

      //throw new Error("stoppeth");
      const s = String(((parseFloat(faccount.amount) * 100) - req.body.amount) / 100);
      const subtract = {
        $set: {
          amount: new Decimal128(s),
        }
      }
      const a = String(((parseFloat(taccount.amount) * 100) + req.body.amount) / 100);
      const add = {
        $set: {
          amount: new Decimal128(a),
        }
      }
      const fupdate = await db_connect.collection("UserAccounts").updateOne(myquery1, subtract);
      const tupdate = await db_connect.collection("UserAccounts").updateOne(myquery2, add);

      
      const date = new Date();
      const recipt = {
        "username": req.body.username,
        "fromAccountID": req.body.from,
        "toAccountID": req.body.to,
        "transactionTotal": new Decimal128(String(req.body.amount / 100)),
        "transactionDateTime": date
      }
      const transaction = await db_connect.collection("Transactions").insertOne(recipt);
      
      const result = {status: "success"};
      res.json(result);
    }

    
  } catch (err) {
    throw err;
  }
});   


//      |                                                       |
//      |   THESE ARE ALL DEPRECIATED BUT HERE FOR REFERENCE    |
//     \ /                                                     \ /


// This section will help you get a list of all the Users.
recordRoutes.route("/record").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb("BankOfWeber");
    const result = await db_connect.collection("Users").find({}).toArray();
    res.json(result);
  } catch (err) {
    throw err;
  }
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("Users").findOne(myquery);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myobj = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const result = await db_connect.collection("Users").insertOne(myobj);
    res.json(result);
  } catch (err) {
    throw err;
  }
});
 
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const newvalues = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const result = await db_connect.collection("Users").updateOne(myquery, newvalues);
    console.log("1 document updated");
    res.json(result);
  } catch (err) {
    throw err;
  }
});
 
// This section will help you delete a record
recordRoutes.route("/:id").delete(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("Users").deleteOne(myquery);
    console.log("1 document deleted");
    res.json(result);
  } catch (err) {
    throw err;
  }
});

//demo sessions
recordRoutes.route("/setSession").get(async function (req, res) {
  console.log(req.session);
  if (!req.session.username) {
    req.session.username = "jeb";
    console.log("Session set");
  } else {
    console.log("Session already existed");
  }
  res.json("{}");
});

recordRoutes.route("/getSession").get(async function (req, res) {
  if (!req.session.username) {
    console.log("No session found");
  } else {
    console.log("User is: " + req.session.username);
  }
  const result = {username: req.session.username};
  res.json(result);
});

module.exports = recordRoutes;