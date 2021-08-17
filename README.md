# fedex-shipping-tracker

To get the app running, type in the following two commands from the root directory.

`npm run install-all`
`npm start`

This will start 3 services: the main app, the database interface, and a fedex integration service. They run on ports 8080, 3000, and 3001 respectively. To view the app, open localhost:8080 in your web browser.

Note: In real-life usage, it is a security risk to autocomplete this kind of information without authentication. It allows third parties to gain information about customers by looking up their tracking number, which would potentially reveal their name, address, and contact information.
