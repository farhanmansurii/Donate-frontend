import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Hero from './components/layout/Hero';
import Navbar3 from './components/layout/Navbar3';
import Home from './components/pages/Home';
import Portal from './components/pages/Portal';
import Staff from './components/pages/Staff';
import Login from './components/auth/Login';
import Map from './components/pages/Map';
import Layout from './components/layout/Layout';
import About from './components/pages/About';
import Footer from './components/pages/Footer';
import Contact from './components/pages/Contact';
import Charity from './components/pages/Charity';
import Search from './components/pages/Search';
import Saved from './components/pages/Saved';
import DonateForm from './components/pages/DonateForm';
import Donate from './components/pages/Donate';
import CreateCampaign from './components/pages/CreateCampaign';
import ReviewCampaigns from './components/pages/ReviewCampaigns';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';


import "./App.css";
import SearchNews from "./components/pages/News";

function onAuthRequired({ history }) {
  history.push("/login");
}

class App extends Component {
  render() {
    return (
      <Router>
        <Security
          issuer="https://trial-8930175.okta.com/oauth2/default"
          client_id="0oaj9bsojfh60Bim6697"
          responseType={["code"]}
          pkce={true}
          redirect_uri={window.location.origin + "/implicit/callback"}
          onAuthRequired={onAuthRequired}
        >
          <div className="App">
            <Navbar3 />
            <Layout>
              <div>
                <Route path="/" exact={true} component={Home} />
                <Route path="/about" exact={true} component={About} />
                <Route path="/create-campaign" exact={true} component={CreateCampaign} />
                <Route path="/donate" exact={true} component={DonateForm} />
                <Route path="/reviewCampaigns" exact={true} component={ReviewCampaigns} />
                <Route path="/News" exact={true} component={SearchNews} />
                <Route path="/Charity" exact={true} component={Charity} />
                <Route path="/Search" exact={true} component={Search} />
                <Route path="/Saved" exact={true} component={Saved} />
                <Route path="/contact" exact={true} component={Contact} />
                <Route path="/portal" exact={true} component={Portal} />
                <SecureRoute path="/staff" exact={true} component={Staff} />
                <Route path="/map" exact={true} component={Map} />
                <Route path="/sign-up" exact={true} component={SignUp} />
                <Route path="/login" exact={true} component={SignIn} />
                <Route path="/implicit/callback" component={ImplicitCallback} />
              </div>
            </Layout>
            <Footer />
          </div>
        </Security>
      </Router>
    );
  }
}

export default App;
