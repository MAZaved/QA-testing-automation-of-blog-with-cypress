// <reference types="Cypress" />

/// JSON fixture file can be loaded directly using
// the built-in JavaScript bundler
// @ts-ignore
const requiredExample = require('../../fixtures/example')

context('Files', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/files')
  })

  beforeEach(() => {
    // load example.json fixture file and store
    // in the test context object
    cy.fixture('example.json').as('example')
  })

  it('cy.fixture() - load a fixture', () => {
    // https://on.cypress.io/fixture

    // Instead of writing a response inline you can
    // use a fixture file's content.

    cy.server()
    cy.fixture('example.json').as('comment')
    // when application makes an Ajax request matching "GET comments/*"
    // Cypress will intercept it and reply with object
    // from the "comment" alias
    cy.route('GET', 'comments/*', '@comment').as('getComment')

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get('.fixture-btn').click()

    cy.wait('@getComment').its('responseBody')
      .should('have.property', 'name')
      .and('include', 'Using fixtures to represent data')

    // you can also just write the fixture in the route
    cy.route('GET', 'comments/*', 'fixture:example.json').as('getComment')

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get('.fixture-btn').click()

    cy.wait('@getComment').its('responseBody')
      .should('have.property', 'name')
      .and('include', 'Using fixtures to represent data')

    // or write fx to represent fixture
    // by default it assumes it's .json
    cy.route('GET', 'comments/*', 'fx:example').as('getComment')

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get('.fixture-btn').click()

    cy.wait('@getComment').its('responseBody')
      .should('have.property', 'name')
      .and('include', 'Using fixtures to represent data')
  })

  it('cy.fixture() or require - load a fixture', function () {
    // we are inside the "function () { ... }"
    // callback and can use test context object "this"
    // "this.example" was loaded in "beforeEach" function callback
    expect(this.example, 'fixture in the test context')
      .to.deep.equal(requiredExample)

    // or use "cy.wrap" and "should('deep.equal', ...)" assertion
    // @ts-ignore
    cy.wrap(this.example, 'fixture vs require')
      .should('deep.equal', requiredExample)
  })
})