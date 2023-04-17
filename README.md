# atm-backend service

### Features:

Atm-backend service is a backend service can be used to interact with any type of client with exposed restful api to achieve following flows:

- Account creation
- Establishing a session
- Deposit an amount of money in session.
- Withdraw an amount of money in session.
  - If you attempt to withdraw more money than you have in your balance, the service would allow the transaction _only_ _if_ the withdrawal will leave your balance greater than or equal to -$100.00 and should apply a $15.00 penalty, otherwise the ATM would automatically reject the withdrawal without applying a penalty.
- Query transaction logs in session (deposit, withdraw, penalty)
- Session log out.

### Non-functional features

- Security
  - Password and email are hashed and encrypted.
  - Every request you need to pass your account id and session id (except for the account creation, which you only give your account info), backend verifies it’s a valid session and recognize you in the session before proceeding.
  - Request parameters are verified with Joi.
- Transaction history
  - Transaction log is stored in Postgres, doesn’t expire.
- Session
  - Session expires in 24 hours if you don’t log out (I know.. it’s too long for the real production service, but this is for demo purpose).

### Run and try this out

Clone this repo to your local, and in project root, run:

```jsx
docker-compose up
```

Make sure you have docker and docker-compose downloaded.

The default port this app runs on is `3000`

Now you can use your preferred api client to call the endpoints to start interacting with the service.

Check API doc [here](https://documenter.getpostman.com/view/811550/2s93XyUPEo) for sample requests and responses.

### A few “unexpected” features

- Account creation doesn’t check duplication (for demo simplicity)
- There’s no login, everything starts with account creation.

## Design Decisions

### Database:

Postgres is used here. Because our data is by nature structural and relational.

I carefully picked concise types to save storage space. So scaling problems will come a little later as traffic grow.

### Session:

Session is in memory. I don’t want to over engineer it, ATM clients are much lesser compared to other type of client like mobile client, and sessions are small. So I’m not so worried about scaling issues here, we can simply scale the servers to meet increased traffic.

### APT:

Restful API. ATM typically has stable internet connection and ensured bandwidth. Restful API doesn’t disqualify and is easy to implement.

### Security:

Password is protected with hashing with salt. Email is protected with encryption with encryption key(which is set for the server instance for simplicity)

## Further Discussions

There are many many things that came to my mind when implementing this. A few important aspects I would put more engineering effort in, if I have infinite time, are as follows:

- **Scalability:** I cannot say the current system is very scalable. But it’s very easy to change is to make it more scalable.
  - Adding load balancer with some consistent hashing before the api servers.
  - Add reverse proxy before databases to handle caching, access to shards(when we have more data), etc
  - Add load balancer before reverse proxy for database
  - Expire transaction data when they are really old, and move those data into a key value store with account id as the key. So we separate “hot” data and “cold” data.
  - Scale the databases by replicating them and sharding them as needed.
  - Sessions should probably track inactive time. When it goes over a certain amount, the session should be closed by server.
- **Security/Consistency:**
  - We probably don’t need account id if ATM can reliably send us session id, since at any time, a ATM can only be used by a single user and view a single account.
  - I’d love to wrap related database operations into database transactions. For example, doing a deposit creates a row in transfers table, and then account balance is adjusted in accounts table. These two should be packed into a single transaction so if one fail the transaction can be rolled back.
  - A double entry ledger should be used when we add bank’s account into the picture.
  - Storing the secret encryption in some key management system. And create different key used for each different email when encrypting emails.
- **Error handling:**
  - I’d like to put all known errors in one place and give them public messages and status code as well as internal messages for debugging. So in our routers we can simply catch the errors and display public messages and internal logs we can have known errors.
- **Tests**
  - Yes, I would write tests if I have unlimited time or if this project is not only for demo purpose.
