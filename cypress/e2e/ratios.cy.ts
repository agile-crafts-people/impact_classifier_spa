describe('ratios Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display ratioss list page', () => {
    cy.visit('/ratioss')
    cy.get('h1').contains('ratioss').should('be.visible')
    cy.get('[data-automation-id="ratios-list-new-button"]').should('be.visible')
  })

  it('should navigate to new ratios page', () => {
    cy.visit('/ratioss')
    cy.get('[data-automation-id="ratios-list-new-button"]').click()
    cy.url().should('include', '/ratioss/new')
    cy.get('h1').contains('New ratios').should('be.visible')
  })

  it('should create a new ratios', () => {
    cy.visit('/ratioss/new')
    
    const timestamp = Date.now()
    const itemName = `test-ratios-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="ratios-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="ratios-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="ratios-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/ratioss/')
    cy.url().should('not.include', '/ratioss/new')
    
    // Verify the ratios name is displayed on edit page
    cy.get('[data-automation-id="ratios-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a ratios', () => {
    // First create a ratios
    cy.visit('/ratioss/new')
    const timestamp = Date.now()
    const itemName = `test-ratios-update-${timestamp}`
    const updatedName = `updated-ratios-${timestamp}`
    
    cy.get('[data-automation-id="ratios-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="ratios-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="ratios-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/ratioss/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="ratios-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="ratios-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="ratios-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="ratios-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="ratios-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="ratios-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the ratios appears with updated name
    cy.get('[data-automation-id="ratios-edit-back-button"]').click()
    cy.url().should('include', '/ratioss')
    
    // Search for the updated ratios
    cy.get('[data-automation-id="ratios-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the ratios appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all ratioss are shown again
    cy.get('[data-automation-id="ratios-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for ratioss', () => {
    // First create a ratios with a unique name
    cy.visit('/ratioss/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="ratios-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="ratios-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="ratios-new-submit-button"]').click()
    cy.url().should('include', '/ratioss/')
    
    // Navigate to list page
    cy.visit('/ratioss')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the ratios
    cy.get('[data-automation-id="ratios-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the ratios
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all ratioss are shown again
    cy.get('[data-automation-id="ratios-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
