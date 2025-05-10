Cypress.Commands.add('loginByOktaApi', (username, password) => {

    const optionsSessionToken = {
        method: 'POST',
        url: 'https://dev-123456.okta.com/api/v1/authn',
        body: {
            username: Cypress.env('username'),
            password: Cypress.env('password'),
            options: {
                warnBeforePasswordExpired: true
            }
        }
    };

    cy.request(optionsSessionToken).then((response) => {
        const sessionToken = response.body.sessionToken;
        const qs = {
            client_id: '--client-id--',
            state: '--state_token--',
            nonce: '--nonce-token--',
            redirect_uri: 'https://localhost:4200/implicit/callback',
            response_mode: 'fragment',
            response_type: 'id_token token',
            scope: ['some', 'scopes', 'of', 'your', 'application'],
            sessionToken
        };

        cy.request({
            metod: 'GET',
            url: 'https://dev-123456.okta.com/oauth2/default/v1/authorize?',
            form: true,
            followRedirect: false,
            qs
        }).then((responseWithToken) => {
            const redirectUrl = responseWithToken.redirectToUrl;

            const accessToken = redirectUrl.subString(redirectUrl.indexOf('access_token'))
                                            .split('&')[0]
                                            .split('=')[1];

            cy.wrap(accessToken).as('accessToken');

            cy.visit(redirectUrl).then(() => {
                cy.visit('/');
            })
        })
    })
});
