import React, {Component} from 'react';
import './App.css';
import Header from './Header'
import jquery from 'jquery'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import TextField from 'material-ui/TextField'
import Pagination from 'material-ui-pagination';

class Recording extends React.PureComponent {
  render() {
    var r = this.props.recording;
    return (<CardTitle title={r.title} subtitle={r.speaker}/>)
  }
}

class Recordings extends React.PureComponent {
  render() {
    var r = this.props.recordings.map((r, i) => (<Recording key={i} recording={r}/>))
    return (
      <div className="recordings">
        {r}
      </div>
    )
  }
}

class Session extends React.PureComponent {
  render() {
    var s = this.props.session;
    return (
      <Card>
        <CardHeader title={s.title} subtitle={s.description}/>

        <CardText>
          <Recordings recordings={s.recordings}/>
        </CardText>
      </Card>
    )
  }
}

class Sessions extends React.PureComponent {
  render() {
    var s = this.props.sessions.map((s) => (<Session key={s._id} session={s}/>))
    return (
      <div className="sessions">
        {s}
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
      limit: 1,
      count: 0,
      page: 1,
      q: null
    }
  }
  get(newstate) {
    var state = Object.assign({}, this.state);
    state = Object.assign(state, newstate)
    this.setState(newstate);

   var url="/sessions";
   //var url="http://washucsc.org:3001/sessions";
    return jquery.getJSON(url, {
      page: state.page,
      q: state.q
    }).then((d) => {
      console.log(d);
      this.setState(d)
      return d;
    })
  }
  componentDidMount() {
    this.get({});
  }
  search = (event, q) => {
    this.get({page: 1, q: q})
  }
  changePage = (page) => {
    this.get({page: page});
  }
  render() {
    var pages = Math.ceil(this.state.count / this.state.limit);
    var pagination = null;
    if (pages > 1) {
      pagination = (
        <div>
          Page {this.state.page} of {pages}
          <Pagination total={pages} display={10} current={this.state.page} onChange={this.changePage}/>
        </div>
      )
    }

    var extra = null;
    if (this.state.q && this.state.q !== "") {
      extra = (
        <div>
          Total number of search results... {this.state.count}
        </div>
      )
    }

    return (
      <div className="container-fluid">
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Header/>
          <TextField hintText="Search" onChange={this.search}/>
          {extra}
          {pagination}
          <Sessions sessions={this.state.sessions}/> {pagination}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
