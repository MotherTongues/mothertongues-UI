describe('flashcards', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/flashcards');
  });

  it('studies All by default', () => {
    cy.contains('ion-button', 'Start (5 cards)').click();
    cy.contains('.progress', '1 / 5');
    cy.get('.flashcard__face--front').should('contain', 'French');

    cy.get('.flashcard').should('have.attr', 'aria-label', 'Show the answer');
    cy.get('.flashcard').click();
    cy.get('.flashcard').should('have.class', 'flashcard--flipped');
    cy.get('.audio ion-button').should('be.visible');

    cy.get('.nav__next').click();
    cy.contains('.progress', '2 / 5');
    cy.get('.flashcard').should('not.have.class', 'flashcard--flipped');

    cy.contains('ion-button', 'Restart').click();
    cy.contains('.progress', '1 / 5');
  });

  it('can change the deck and direction', () => {
    cy.get('ion-select').click();
    cy.contains('.alert-radio-label', 'minerals (1)').click();
    cy.contains('.alert-button', 'OK').click();
    cy.contains('ion-radio', 'English → French').click();
    cy.contains('ion-button', 'Start (1 card)').click();
    cy.get('.flashcard__face--front').should('contain', 'English');
    cy.get('.flashcard__face--front').should('contain', 'granite');

    // The session is kept when leaving the page (the split pane keeps the
    // menu open at Cypress' default viewport width)
    cy.contains('ion-menu ion-item', 'About').click();
    cy.contains('ion-menu ion-item', 'Flashcards').click();
    cy.contains('.progress', '1 / 1');

    cy.contains('ion-button', 'Change deck').click();
    cy.contains('ion-button', 'Start (1 card)');
  });
});
