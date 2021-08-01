# Integration Test

To get start

```
export vidly_jwtPrivateKey=mySecureKey
```

Set the test environment

```
NODE_ENV=test node index.js
```

run

```
npm test
```

When we edit the code, jest will rerun automatically and load the server again causing exception because we already has the server up and run on port 3000. So in the integration test we should load the server before and shutdown after test

```JS
 describe("/api/genres", () => {

  // clean up the test so it is repeatable
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
});
```
