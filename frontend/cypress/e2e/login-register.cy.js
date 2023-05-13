/* eslint-disable no-undef */
describe('user can login/signup', () => {
  it('testing login flow', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[id="Penn ID"]').type('12312312');
    cy.get('input[id="Penn ID"]').should('have.value', '12312312');
    cy.get('input[id="Password"]').type('12345');
    cy.get('input[id="Password"]').should('have.value', '12345');
    cy.get('button').contains('Login').click();
    cy.contains('Available Products');
  });
  it('testing register flow', () => {
    cy.visit('http://localhost:3000');
    cy.get('.signup');
    cy.get('.signup').click();
    cy.get('button').contains('Join the Community!');
    cy.get('input[id="Email"').type('test@email.com');
    cy.get('input[id="Email"]').should('have.value', 'test@email.com');
    cy.get('input[id="Username"').type('testUser');
    cy.get('input[id="Username"]').should('have.value', 'testUser');
    cy.get('input[id="Penn ID"]').type('00000000');
    cy.get('input[id="Penn ID"]').should('have.value', '00000000');
    cy.get('input[id="Password"]').type('12345');
    cy.get('input[id="Password"]').should('have.value', '12345');
    cy.get('button').contains('Join the Community!').click();
    cy.contains('We are glad to have you here');
  });
});
