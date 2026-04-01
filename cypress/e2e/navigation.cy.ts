describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should open navigation drawer with hamburger menu', () => {
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Check that drawer is visible with domain sections
    cy.contains('SENTIMENT DOMAIN').should('be.exist')
    cy.contains('RATIO DOMAIN').should('be.exist')
    cy.contains('POST DOMAIN').should('be.exist')
    cy.contains('COMMENT DOMAIN').should('be.exist')
    cy.contains('USER DOMAIN').should('be.exist')
  })
  it('should have all sentiment domain links in drawer', () => {
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-sentiments-list-link"]').scrollIntoView().should('be.visible')
    cy.get('[data-automation-id="nav-sentiments-new-link"]').scrollIntoView().should('be.visible')
  })
  it('should have all ratio domain links in drawer', () => {
    cy.visit('/ratios')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-ratios-list-link"]').scrollIntoView().should('be.visible')
    cy.get('[data-automation-id="nav-ratios-new-link"]').scrollIntoView().should('be.visible')
  })
  it('should have post domain link in drawer', () => {
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-posts-list-link"]').scrollIntoView().should('be.visible')
  })
  it('should have comment domain link in drawer', () => {
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-comments-list-link"]').scrollIntoView().should('be.visible')
  })
  it('should have user domain link in drawer', () => {
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-users-list-link"]').scrollIntoView().should('be.visible')
  })

  it('should have admin and logout at bottom of drawer', () => {
    // Login with admin role to see admin link
    cy.login(['admin'])
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Admin and Logout should be visible in the drawer
    cy.get('[data-automation-id="nav-admin-link"]').scrollIntoView().should('be.visible')
    cy.get('[data-automation-id="nav-logout-link"]').scrollIntoView().should('be.visible')
  })

  it('should navigate to different pages from drawer', () => {
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-posts-list-link"]').scrollIntoView().click()
    cy.url().should('include', '/posts')
  })

  it('should close drawer after navigation', () => {
    cy.visit('/sentiments')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-posts-list-link"]').scrollIntoView().click()
    
    // Drawer should close after navigation (temporary drawer)
    cy.wait(500)
    cy.contains('SENTIMENT DOMAIN').should('not.be.visible')
  })
})