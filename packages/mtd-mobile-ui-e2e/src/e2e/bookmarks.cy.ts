describe('bookmarks', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('shows instructions when nothing is bookmarked', () => {
    cy.visit('/bookmarks');
    cy.contains("You haven't bookmarked any words yet.").should('be.visible');
  });

  it('bookmarks an entry, lists it, and removes it', () => {
    cy.visit('/browse');
    cy.contains('ion-item', 'alouette').click();
    // Ionic moves aria-label onto the inner native button, so select by class
    cy.get('ion-modal .entry__bookmark ion-icon').should(
      'have.attr',
      'name',
      'bookmark-outline'
    );
    cy.get('ion-modal .entry__bookmark').click();
    cy.get('ion-modal .entry__bookmark ion-icon').should(
      'have.attr',
      'name',
      'bookmark'
    );
    cy.get('ion-modal').contains('ion-button', 'Close').click();

    // Bookmarks persist across reloads
    cy.visit('/bookmarks');
    cy.contains('ion-item', 'alouette').should('be.visible');

    cy.get('.edit-toggle').click();
    cy.contains('ion-button', 'Remove 0 selected bookmarks').should(
      'have.attr',
      'disabled'
    );
    cy.contains('ion-item', 'alouette').find('ion-checkbox').click();
    cy.contains('ion-button', 'Remove 1 selected bookmark').click();
    cy.contains("You haven't bookmarked any words yet.").should('be.visible');
  });
});
