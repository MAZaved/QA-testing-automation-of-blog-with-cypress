// const { before } = require("mocha")

context('Assertions', () => {
    before(() => {
        cy.visit('https://example.cypress.io/commands/assertions')
    })

    describe('Implicit Assertions', () => {
        it('.should() - make an assertion about the current subject', () => {
            cy.get('.assertion-table')
              .find('tbody tr:last')
              .should('have.class', 'success')
              .find('td')
              .first()
              .should('have.text', 'Column content')
              .should('contain', 'Column content')
              .should('have.html', 'Column content')
              .should('match', 'td')
              .invoke('text')
              .should('match', /column content/i)

            cy.get('.assertion-table')
              .find('tobdy tr:last')
              .contains('td', /column content/i)
              .should('be.visible')
        })

        it('.and() - chain multiple assertions together', () => {
            cy.get('.assertions-link')
              .should('have.class', 'active')
              .and('have.attr', 'href')
              .and('include', 'cypress.io')
        })
    })
})