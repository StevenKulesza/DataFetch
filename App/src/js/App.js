import React from 'react';
import Collapsible from './collapsible'
import image from '../images/expand-vertical-4.svg';

class App extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      isLoading: true,
      contacts: []
    }
  }

  componentWillMount() {
    localStorage.getItem('contacts') && this.setState({
      contacts: JSON.parse(localStorage.getItem('contacts')),
      isLoading: false
    })
  }

  componentDidMount(){
    if(!localStorage.getItem('contacts')){
      this.fetchData();
    } else {
      console.log('using data from localStorage');
    }
  }

  fetchData(){
    fetch('https://randomuser.me/api/?results=50&nat=us,dk,fr,gb')
    .then(response => response.json())
    .then(parsedJSON => parsedJSON.results.map(user =>  (
      {
        name: `${user.name.first} ${user.name.last}`,
        username: `${user.login.username}`,
        email: `${user.email}`,
        location: `${user.location.street}, ${user.location.city}`
      }
    )))
    .then(contacts => this.setState({
      contacts,
      isLoading: false
    }))
    .catch(error => console.log('parsing failed', error))
  }

  componentWillUpdate(nextProps, nextState){
    localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
    localStorage.setItem('contactsDate', Date.now());
  }

    render() {
      const {isLoading, contacts} = this.state;

      return (
          <div>
              <header>
                  <h1>The header</h1>
              </header>
              <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                  <div className="panel-group">
                    {
                      !isLoading && contacts.length > 0 ? contacts.map(contact => {
                        const {username, name, email, location} = contact;
                        return <Collapsible key={username} title={name}>
                          <p>{email}<br/> {location}</p>
                        </Collapsible>
                      }) : null
                    }
                  </div>
                  <div className='loader'>
                    <div className='icon'></div>
                  </div>
              </div>
          </div>
      );
    }
}

export default App;
