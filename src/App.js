import React, {Component} from 'react';
import './App.css';
import './paginate.css';
import Header from './Header'
import jquery from 'jquery'
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import TextField from 'material-ui/TextField'
import Pagination from 'material-ui-pagination';
import ReactPaginate from 'react-paginate';
import RaisedButton from 'material-ui/RaisedButton';
import {BrowserRouter as Router, Link, Route, Switch, Redirect} from 'react-router-dom'

class PlayRecording extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  play = () => {
    this.setState({showVideo: true})
  }
  render() {
    var video = null;
    if (this.state.showVideo) {
      video = <iframe title={this.props.recording.youtube_url} width="560" height="315" src={this.props.recording.youtube_url} frameBorder="0" allowFullScreen></iframe>
    } else {
      video = (<RaisedButton onClick={this.play} label="Play Recording"/>)
      video = (
        <Link to={`/r/${this.props.session._id}/0`}>Play Recording</Link>
      )
    }
    return video;
  }
}

class Recording extends React.PureComponent {
  render() {
    var r = this.props.recording;
    return (
      <div className="recording"><CardTitle title={r.title} subtitle={r.speaker}/>
        <PlayRecording session={this.props.session} recording={r}/>
      </div>
    )
  }
}

class Recordings extends React.PureComponent {
  render() {
    var r = this.props.recordings.map((r, i) => (<Recording key={i} session={this.props.session} recording={r}/>))
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
      <Card className="session">
        <CardHeader title={s.title} subtitle={s.description}/>

        <CardText>
          <Recordings session={s} recordings={s.recordings}/>
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

class RecRoute extends React.Component {
  render() {
    return (
      <LoadPageData id={this.props.match.params.sessionID} >
        <Rec/>
      </LoadPageData>
    )
  }
}

class LoadPageData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.attrs = ['id','q','page']
  }
  componentDidMount() {
    this.get(this.props);
  }
  componentWillReceiveProps(nextProps) {
    for(var i in this.attrs) {
      var a = this.attrs[i];
      if(this.props[a] !== nextProps[a]) {
        this.get(nextProps);
        return;
      }
    }
  }
  get(props) {
    var url = "/sessions";
    this.setState({
      loading: true,
      data: null
    })

    var args = {}
    this.attrs.forEach((a) => {
      if(props[a]) {
        args[a] = props[a];
      }
    })

    jquery.getJSON(url, args).then((d) => {
      this.setState({
        data: d
      })
      console.log(d);
      //this.setState(d)
      //return d;
    }).fail(() => {
      this.setState({error: "Error: couldn't retrieve recordings.  Please contact John Aughey jha@aughey.com"})
    }).always(() => {
      this.setState({loading: false})
    });
  }
  render() {
    if(this.state.data) {
      var children = this.props.children
      var childrenWithProps = React.Children.map(children, child => React.cloneElement(child, { data: this.state.data }))
      return (
        <div>{childrenWithProps}</div>
      )
    } else {
      return (
        <div><img alt="loading" src="/ajax-loader.gif"/></div>
      )
      /*
      return (
        <div>Loading maybe?
          Props
          <pre>{JSON.stringify(this.zprops,null,' ')}</pre>
          State
          <pre>{JSON.stringify(this.state,null,' ')}</pre>
        </div>
      )
      */
    }
  }
}

class Rec extends React.PureComponent {
  render() {
    return (
        <Session session={this.props.data.sessions[0]} />
      )
  }
}


class SearchInput extends Component {
  search = (e,q) => {
    console.log(e);
    this.q = q;
  }
  doSearch = () => {
    console.log(this.props);
    this.props.history.push("/search/" + this.q);
  }
  render() {
    return (
      <div>
        <TextField hintText="Search" onChange={this.search}/><button onClick={this.doSearch}>Search</button>
      </div>
    )
  }
}

class GetContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.page = 1;
  }
  get() {
    var q = this.props.q;
    var url = "/sessions";
    this.setState({
      loading: true
    })

    jquery.getJSON(url, {page: this.page, q: q}).then((d) => {
      console.log(d);
      this.setState(d)
      return d;
    }).fail(() => {
      this.setState({error: "Error: couldn't retrieve recordings.  Please contact John Aughey jha@aughey.com"})
    }).always(() => {
      this.setState({loading: false})
      if (this.fetch_again) {
        var q = this.fetch_again;
        delete this.fetch_again;
        this.get(q);
        return;
      }
    });
  }
  changePage = (page) => {
    console.log(page);
    this.props.history.push("/page/" + page);
  }
  componentDidMount() {
    this.get();
  }
  render() {
    if (this.state.loading) {
      return (
        <div><img alt="loading" src="/ajax-loader.gif"/></div>
      )
    }

    var pages = Math.ceil(this.state.count / this.state.limit);
    var pagination = null;
    if (pages > 1) {
      pagination = (
        <div>
          Page {this.state.page}
          of {pages}
          <ReactPaginate forcePage={this.state.page - 1} breakLabel={<a>...</a>} breakClassName="break-me" containerClassName="pagination" subContainerClassName="pages pagination" activeClassName="active" pageCount={pages} display={10} current={this.state.page} onPageChange={this.changePage}/>
        </div>
      )
    }

    return (
      <div className="content">
        {pagination}
        <Sessions sessions={this.state.sessions}/> {pagination}
      </div>
    )
  }
}

class Search extends React.PureComponent {
  render() {
    var params = this.props.match.params;
    return (
      <div>
      <div>Search Term: {params.search}</div>
      <GetContent q={params.search}/>
    </div>
    )
  }
}

class App extends Component {
  //<Route path="/" component={SearchInput}/>

  render() {
    return (
      <Router>
        <div className="app container">
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <div className="row">
              <Header/>
              <Switch>
              <Route path="/r/:sessionID/:recordingID" component={RecRoute}/>
              <Route path="/search/:search" component={Search}/>
              <Route path="/page/:page" component={RoutePage}/>
              <Route path="*" component={PageRedirect}/>
            </Switch>
            </div>
          </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}

class PageRedirect extends React.PureComponent {
  render() {
    return (
      <Redirect to="/page/1"/>
    )
  }
}

class PaginatedSessions extends React.PureComponent {
  changePage = (page) => {
    this.props.history.push("/page/" + (page.selected+1));
  }

  render() {
    var data = this.props.data;
    var pages = Math.ceil(data.count / data.limit);
    var pagination = null;
    if (pages > 1) {
      pagination = (
        <div>
          Page {this.props.page}
          of {pages}
          <ReactPaginate forcePage={this.props.page - 1} breakLabel={<a>...</a>} breakClassName="break-me" containerClassName="pagination" subContainerClassName="pages pagination" activeClassName="active" pageCount={pages} display={10} current={this.props.page} onPageChange={this.changePage}/>
        </div>
      )
    }

    return (
      <div>
        {pagination}
        <Sessions sessions={data.sessions}/>
      </div>
    )
  }
}

class RoutePage extends Component {
  render() {
    console.log(this.props);
    var page = this.props.match.params.page;
    return (
      <div>
        <LoadPageData page={page}>
          <PaginatedSessions history={this.props.history} page={page}/>
        </LoadPageData>
      </div>
    )
  }
}

export default App;
