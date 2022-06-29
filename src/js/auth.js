import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import crypto from 'crypto-js';

/* eslint-disable-next-line no-undef */
const appBaseUrl = typeof baseUrl !== 'undefined' ? baseUrl : '/';
const fullBaseUrl = window.location.origin + appBaseUrl;

const settings = {
  authority: 'https://idp.int.identitysandbox.gov',
  client_id: 'urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:gsa-fac-pkce-01',
  redirect_uri: fullBaseUrl + 'auth/post-login', // baseUrl is set in a script tag right before this script loads
  post_logout_redirect_uri: fullBaseUrl,
  response_type: 'code',
  scope: 'openid email roles',

  response_mode: 'query',

  automaticSilentRenew: false,
  filterProtocolClaims: true,
  acr_values: 'http://idmanagement.gov/ns/assurance/ial/1',
};

const userManager = new UserManager(settings);

const tokenStore = new WebStorageStateStore();

export const getApiToken = () => {
  return tokenStore.get('fac-api-token');
};

(function () {
  function attachSignInButtonHandler() {
    const signInButton = document.getElementById('sign-in');
    if (signInButton) {
      signInButton.addEventListener('click', () => {
        const nonce = crypto.lib.WordArray.random(32).toString(
          crypto.enc.Base64
        );

        userManager.signinRedirect({
          state: {
            some: 'data',
          },
          nonce,
        });
      });
    }
  }

  function attachEventHandlers() {
    attachSignInButtonHandler();

    const postLoginRedirect = document.getElementById('post-login-redirect');
    if (postLoginRedirect) {
      userManager.signinRedirectCallback().then(function (userInfo) {
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + userInfo.id_token);

        const ENDPOINT = 'https://fac-dev.app.cloud.gov/api/auth/token';
        //const ENDPOINT = 'http://localhost:8000/api/auth/token';

        // exchange the login.gov JWT for the FAC API token
        fetch(ENDPOINT, {
          method: 'POST',
          headers: headers,
        })
          .then((resp) => resp.json())
          .then((data) => tokenStore.set('fac-api-token', data.token))
          .then(() => (window.location = appBaseUrl));
      });
    }
  }

  function init() {
    attachEventHandlers();
  }

  init();
})();
