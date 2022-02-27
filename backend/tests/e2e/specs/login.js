describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    // Emulate logout
    cy.clearCookies();
  });

  it('displays form validation', () => {
    cy.get('[data-cy="login-username"]').clear();
    cy.get('[data-cy="login-password"]').clear();

    cy.get('[data-cy="login-form"]').submit();

    cy.get('[data-cy="login-username-invalid"]').should('be.visible');

    cy.get('[data-cy="login-password-invalid"]').should('be.visible');
  });

  it('displays error with invalid credentials', () => {
    cy.get('[data-cy="login-username"]').type('invalid-user');
    cy.get('[data-cy="login-password"]').type('invalid-password');

    cy.get('[data-cy="login-form"]').submit();

    cy.get('[data-cy="login-username-invalid"]').should('not.be.visible');

    cy.get('[data-cy="login-password-invalid"]').should('not.be.visible');

    cy.get('[data-cy="login-error-message"]').should('contain', 'Your username or password is incorrect.');
  });

  it('logins successfully with valid credentials', () => {
    cy.get('[data-cy="login-username"]').type('staff');
    cy.get('[data-cy="login-password"]').type('123456');

    cy.get('[data-cy="login-form"]').submit();

    cy.get('[data-cy="nav-bar-welcome-text"] a').should('contain', 'Welcome, Staff');
  });
});
