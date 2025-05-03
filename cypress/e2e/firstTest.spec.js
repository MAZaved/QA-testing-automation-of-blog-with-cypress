

describe('Test with backend', () => {

  beforeEach('login to application',() => {
    cy.intercept({method:'Get', path:'tags'}, { fixture: 'tags.json' })
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' })
    cy.loginToApplication();
  })

  // it('first', () => {
  //   cy.log('Successfully logged in');
  // })


  it('verify correct request and response', () => {

    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticle');

    cy.contains('New Article').click();
    cy.get('[formcontrolname="title"]').type('Test Article');
    cy.get('[formcontrolname="description"]').type('This is a test description for the article.');
    cy.get('[formcontrolname="body"]').type('This is the body of the test article.');
    cy.contains('Publish Article').click();

    cy.wait('@postArticle')
    cy.get('@postArticle').then((xhr) => {
      console.log('xhr: ', xhr)    
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.response.body.article.body).to.equal('This is the body of the test article.')
      expect(xhr.response.body.article.description).to.equal('This is a test description for the article.')
    })

  })


  it('intercepting and modifying the request and response', () => {

    // cy.intercept('POST', '**/articles/', (req) =>{
    //   req.body.article.description = "This is a description 2"
    // }).as('postArticle')

    cy.intercept('POST', '**/articles/', (req) =>{
      req.reply( res => {
        expect(res.body.article.description).to.equal("This is a description")
        res.body.article.description = "This is a description 2"
      })
    }).as('postArticle')

    cy.contains('New Article').click();
    cy.get('[formcontrolname="title"]').type('This is a test title 2')
    cy.get('[formcontrolname="description"]').type('This is a test description for the article.');
    cy.get('[formcontrolname="body"]').type('This is the body of the test article.');
    cy.contains('Publish Article').click();

    cy.wait('@postArticle')
    cy.get('@postArticle').then((xhr) => {
      console.log('xhr: ', xhr)    
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.response.body.article.body).to.equal('This is the body of the test article.')
      expect(xhr.response.body.article.description).to.equal('This is a description 2')
    })

  })


  it('verify popular tags are displayed', () => {
    cy.log('Successfully logged in')

    // cy.wait(3000)

    cy.get('.tag-list')
    .should('contain', 'cypress')
    .and('contain', 'test')
    .and('contain', 'automation')

  })

  it('verify global like count', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {"articles":[],"articlesCount":0})
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json' })

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then( heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
    })

    cy.fixture('articles.json').then(( file) => {
      const articleLink = file.articles[1].slug
      file.articles[1].favoritesCount = 6   
      cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/${articleLink}/favorite', file)
    })

    cy.get('app-article-list button').eq(1).click().should('contain', '6')

  })

  it.only('Delete an article', () => {

    // const userCredentials = {
    //   "user": {
    //     "email": "cytest90@gmail.com",
    //     "password": "1234"
    //   }
    // }

    const bodyRequest = {
      "article": {
          "tagList": [],
          "title": "Request from API",
          "description": "Request from API description",
          "body": "Request from API body"
      }
    }

    // cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', userCredentials).its('body').then( body => {
    cy.get('@token').then( token => {
      

      cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/articles',
        headers: {'Authorization': 'Token ' +token},
        method: 'POST',
        body: bodyRequest
      }).then( response  => {
        expect(response.status).to.equal(201)
      })

      cy.contains('Global Feed').click()
      cy.wait(2000)
      cy.get('.article-preview').first().click()
      cy.wait(2000)
      // cy.get('.btn-outline-danger').click()
      cy.get('.article-actions').contains('Delete Article').click()

      cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/articles',
        headers: {'Authorization': 'Token ' +token},
        method: 'GET'
      }).its('body').then( body => {
        const articles = body.articles
        expect(articles[0].title).to.not.contain('Request from API')
      })
    })
  })

})

