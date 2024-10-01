import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

const Theme = {
  fontPrimary: "'Poppins', sans-serif",
  fontSecondary: "'Playfair Display', serif",
  primary: '#C9A86A',
  secondary: '#8A7968',
  accent: '#D64C31',
  background: '#0F1419',
  surface: '#1E2328',
  text: '#F2F2F2',
  textDark: '#A0A0A0',
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Playfair+Display:wght@400;700&display=swap');

  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: ${props => props.theme.fontPrimary};
  }
`;

const Jumbotron = styled.div`
  background-color: ${props => props.theme.surface};
  padding: 250px 2rem;
  margin-top: ;
  margin-bottom: 2rem;
  border-radius: 0.3rem;
`;

const Container = styled.div`
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  max-width: 1140px;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fontSecondary};
  color: ${props => props.theme.primary};
  font-size: 3.5rem;
  margin-bottom: 1rem;
`;

const Lead = styled.p`
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.text};
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ExternalLink = styled.a`
  color: ${props => props.theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

class Portal extends Component {
  state = { authenticated: null };

  constructor(props) {
    super(props);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  };

  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  login = async () => {
    this.props.auth.login('/portal');
  };

  logout = async () => {
    this.props.auth.logout('/portal');
  };

  render() {
    if (this.state.authenticated === null) return null;

    const mainContent = this.state.authenticated ? (
      <div>
        <Lead>
          You have entered the member portal,{' '}
          <StyledLink to="/staff">click here</StyledLink>
        </Lead>
        <Button onClick={this.logout}>Logout</Button>
      </div>
    ) : (
      <div>
        <Lead>
          To create a new User Account please{' '}
          <ExternalLink href="https://trial-8930175.okta.com/signin/register" target="_blank">
            click here! (Create new account)
          </ExternalLink>
        </Lead>
        <Lead>If you are an active member please login.</Lead>
        <Button onClick={this.login}>Login</Button>
      </div>
    );

    return (
      <ThemeProvider theme={Theme}>
        <GlobalStyle />
        <Jumbotron>
          <Container>
            <Title>Donation</Title>
            {mainContent}
          </Container>
        </Jumbotron>
      </ThemeProvider>
    );
  }
}

export default withAuth(Portal);
