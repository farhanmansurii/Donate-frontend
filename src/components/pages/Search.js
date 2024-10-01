import React, { Component } from "react";
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import API from "../../utils/API";
import Results from "../Results";
import ViewBtn from "../ViewBtn";
import SaveBtn from "../SaveBtn";

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

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 140px auto;
  padding: 20px;
  box-sizing: border-box;
`;

const Heading = styled.div`
  h1 {
    font-family: ${props => props.theme.fontSecondary};
    color: ${props => props.theme.primary};
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  h3 {
    color: ${props => props.theme.textDark};
    font-size: 1.2rem;
  }
`;

const SearchBar = styled.div`
  background-color: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  h3 {
    color: ${props => props.theme.primary};
    margin-bottom: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const FormBtn = styled.button`
  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.text};
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultItem = styled.li`
  background-color: ${props => props.theme.surface};
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
`;

class Search extends Component {
  state = {
    search: "",
    results: [],
  };

  searchrapidapi = (query) => {
    let query1 = query.replace(" ", "+");
    console.log("1. " + query1);
    API.search(query1)
      .then((res) => this.setState({ results: res.data, search: "" }))
      .catch((err) => console.log(err));
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleCharitySearch = (event) => {
    event.preventDefault();
    this.searchrapidapi(this.state.search);
  };

  handleCharitySave = (event) => {
    API.saveCharity({
      name: event.charityName,
      description: event.tagLine,
      cause: event.cause.causeName,
      imageurl: event.currentRating.ratingImage.large,
      url: event.websiteURL,
    })
      .then((res) => this.setState({ search: "" }))
      .catch((err) => console.log(err));
  };


  render() {
    return (
      <ThemeProvider theme={Theme}>
        <GlobalStyle />
        <Container>
          <Heading>
            <h1>Charity Search</h1>
            <h3>Search for and Save Charities of interest</h3>
          </Heading>
          <SearchBar>
            <h3>Search by Charity Title</h3>
            <form>
              <Input
                value={this.state.search}
                onChange={this.handleInputChange}
                name="search"
                placeholder="Enter the title of the charity you are looking for"
              />
              <FormBtn
                disabled={!this.state.search}
                onClick={this.handleCharitySearch}
              >
                Search
              </FormBtn>
            </form>
          </SearchBar>

            <ul>
              {this.state.results &&
                this.state.results.map((result) => (
                  <ResultItem key={result.ein}>
                    {result.currentRating ? (
                      <img
                        alt="rating stars"
                        src={result.currentRating.ratingImage.large}
                        style={{ maxWidth: '100px', marginBottom: '10px' }}
                      />
                    ) : (
                      <p>No image</p>
                    )}
                    <h4>{result.charityName}</h4>
                    <p>{result.cause && result.cause.causeName}</p>
                    <p>{result.tagLine}</p>
                    <div>
                      <ViewBtn onClick={() => window.open(result.websiteURL)} />
                      <SaveBtn onClick={() => this.handleCharitySave(result)} />
                    </div>
                  </ResultItem>
                ))}
            </ul>

        </Container>
      </ThemeProvider>
    );
  }
}

export default Search;
