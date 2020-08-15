# Contribute to Loki

### Set up for development

- Copy .env.example to .env and change env vars values

- Install dependencies

```bash
npm install
cd app
npm install
```

- First run ReactJS app

```bash
cd app
npm start
```

- Then run ExpressJS app

```bash
source .env
npm run start:dev
```

In development environment, the ExpressJS app mirrors the react app on `/` route, 
so after running it, open `http://localhost:9192` in your browser.
