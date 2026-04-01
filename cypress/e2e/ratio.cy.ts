describe('Ratio Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display ratios list page', () => {
    cy.visit('/ratios')
    cy.get('h1').contains('Ratios').should('be.visible')
    cy.get('[data-automation-id="ratio-list-new-button"]').should('be.visible')
  })

  it('should navigate to new ratio page', () => {
    cy.visit('/ratios')
    cy.get('[data-automation-id="ratio-list-new-button"]').click()
    cy.url().should('include', '/ratios/new')
    cy.get('h1').contains('New Ratio').should('be.visible')
  })

  it('should create a new ratio', () => {
    cy.visit('/ratios/new')
    
    const timestamp = Date.now()
    const itemName = `test-ratio-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="ratio-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="ratio-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="ratio-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/ratios/')
    cy.url().should('not.include', '/ratios/new')
    
    // Verify the ratio name is displayed on edit page
    cy.get('[data-automation-id="ratio-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a ratio', () => {
    // First create a ratio
    cy.visit('/ratios/new')
    const timestamp = Date.now()
    const itemName = `test-ratio-update-${timestamp}`
    const updatedName = `updated-ratio-${timestamp}`
    
    cy.get('[data-automation-id="ratio-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="ratio-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="ratio-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/ratios/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="ratio-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="ratio-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="ratio-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="ratio-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="ratio-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="ratio-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the ratio appears with updated name
    cy.get('[data-automation-id="ratio-edit-back-button"]').click()
    cy.url().should('include', '/ratios')
    
    // Search for the updated ratio
    cy.get('[data-automation-id="ratio-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the ratio appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all ratios are shown again
    cy.get('[data-automation-id="ratio-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for ratios', () => {
    // First create a ratio with a unique name
    cy.visit('/ratios/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="ratio-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="ratio-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="ratio-new-submit-button"]').click()
    cy.url().should('include', '/ratios/')
    
    // Navigate to list page
    cy.visit('/ratios')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the ratio
    cy.get('[data-automation-id="ratio-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the ratio
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all ratios are shown again
    cy.get('[data-automation-id="ratio-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
