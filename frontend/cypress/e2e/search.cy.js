/* eslint-disable no-undef */
describe('user can modify and search for a product', () => {
  it('testing modify flow', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[id="Penn ID"]').type('12345678');
    cy.get('input[id="Password"]').type('ben');
    cy.get('button').contains('Login').click();
    cy.get('[id="header-search-input"]').type('guitar');
    cy.get('[id="searchicon"]').click();
    cy.contains('$200');
    cy.contains('Guitar');
  });
});
