describe( 'Test logout', () => {

    beforeEach('login to application',() => {
        cy.loginToApplication()
    })
    
    it('verify user can log out successfully', {retries: 2} , () => {
        // cy.wait(5000)
        cy.contains('Settings').click()
        // cy.wait(3000)
        cy.contains('Or click here to logout.').click()
        cy.get('.navbar-nav').should('contain', 'Sign in')
    })
})