/* eslint-disable no-undef */
// https://stackoverflow.com/questions/51246606/test-loading-of-image-in-cypress
describe('user can modify and search for a product', () => {
  it('testing modify flow', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[id="Penn ID"]').type('12345678');
    cy.get('input[id="Password"]').type('ben');
    cy.get('button').contains('Login').click();
    cy.get('[id="header-usericon"]').click();
    cy.get('[id="posted"]').click();
    cy.get('button').contains('Modify').click();
    cy.contains('Modify Product');
    cy.get('[id="descriptionInput"]').type('. Barely used.');
    cy.get('button').contains('Upload').click();
    cy.contains('Profile Information');
  });
});
