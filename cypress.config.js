const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "cypress-report-config.json"
  },

  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  env: {
    username: "cytest90@gmail.com",
    password: "1234",
    apiUrl: "https://conduit-api.bondaracademy.com",
  },

  retries: {
    runMode: 2,
    openMode: 0,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const username = process.env.DB_USERNAME
      const password = process.env.DB_PASSWORD

      // if(!password)
      // {
      //   throw new Error("missing PASSWORD environment variable")
      // }

      config.env = {username, password}
      return config

    },
    baseUrl: "https://conduit.bondaracademy.com/",
    // api: "https://conduit-api.bondaracademy.com/",
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",
  },
});
