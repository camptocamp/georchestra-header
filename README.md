# geOrchestra *Fork* header

The geOrchestra header is built using Vue and published as a web component called `geor-header`.

## Header.js

Header.js file is the js file used to build the webcomponent.
It is built using the command `npm run build` which create the file inside `dist/assets/` folder.

## Development

Most development are done in `header.ce.vue` file.

To run the development server use the command `npm run dev`.

### Fake admin account

Here is a fake admin account to test the admin functionalities:

```javascript
const jsonFake = {
  "GeorchestraUser": {
    "username": "jdoe",
    "roles": [
      "ROLE_MAPSTORE_ADMIN",
      "ROLE_DSP_ILEVIA",
      "ROLE_GN_EDITOR",
      "ROLE_USER",
      "ROLE_ADMINISTRATOR",
      "ROLE_SUPERUSER"
    ],
    "organization": "georchestra",
    "id": "961b3749-d5c13b2df7",
    "lastUpdated": "37ad990ece9c0b0e6d42b52fdce45849292cd9468",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@yopmail.com",
    "isExternalAuth": false,
    "oauth2Provider": null,
    "oauth2Uid": null
  }
}
```

Then replace `const user = json.GeorchestraUser` with `const user = jsonFake.GeorchestraUser` in `auth.ts` file.

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Compile and Minify for Production

```sh
npm run build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
