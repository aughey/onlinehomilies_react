import React, {Component} from 'react';
//import './App.css';
import './paginate.css';
import Header from './Header'
import jquery from 'jquery'
//import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
//import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
//import getMuiTheme from 'material-ui/styles/getMuiTheme'
//import TextField from 'material-ui/TextField'
//import Pagination from 'material-ui-pagination';
import ReactPaginate from 'react-paginate';
//import RaisedButton from 'material-ui/RaisedButton';
import {BrowserRouter as Router, Link, Route, Switch, Redirect} from 'react-router-dom'

/*
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
*/

class Recording extends React.PureComponent {
  render() {
    var r = this.props.recording;

    var video = null;

    var inner_content = (
      <div>
        <h1>{r.title}</h1>
        <h2>{r.speaker}</h2>
      </div>
    )

    if (this.props.showVideo) {
      video = <iframe title={this.props.recording.youtube_url} width="560" height="315" src={this.props.recording.youtube_url} frameBorder="0" allowFullScreen></iframe>

      return (
        <div className="recording text-center">
            {inner_content}
            {video}
        </div>
      )
    } else {
      return (
        <div className="recording text-center">
          <Link to={`/r/${this.props.session._id}/0`}>
            {inner_content}
          </Link>
        </div>
      )
    }
  }
}

class Recordings extends React.PureComponent {
  render() {
    var r = this.props.recordings.map((r, i) => (<Recording key={i} showVideo={this.props.showVideo} session={this.props.session} recording={r}/>))
    return (
      <div className="recordings">
        {r}
      </div>
    )
  }
}

class Session extends React.PureComponent {
  /*
  <Card className="session">
    <CardHeader title={s.title} subtitle={s.description}/>

    <CardText>
      <Recordings session={s} recordings={s.recordings}/>
    </CardText>
  </Card>
  */
  render() {
    var s = this.props.session;
    //<img className="card-img-top" src={"/backgrounds/" + this.props.background + ".jpg"} alt=""/>
    return (
      <div className={"session card h-100 background" + this.props.background}>

        <div className="card-body">
          <Recordings showVideo={this.props.showVideo} session={s} recordings={s.recordings}/>
          <div class='bottom'>
            <small>
              {s.title}
              - {s.description}
            </small>
          </div>
        </div>
      </div>
    )
  }
}

class Sessions extends React.PureComponent {
  render() {

    var s = this.props.sessions.map((s, i) => (
      <div className="col-lg-4 col-sm-8"><Session key={s._id} session={s} background={i % 8}/></div>
    ))

    return (
      <div className="card-group">
        {s}
      </div>
    )
  }
}

class SingleRec extends React.PureComponent {
  render() {
    console.log(this.props)
    return (
      <div className="col-12"><Session showVideo={true} background={0} session={this.props.data.sessions[0]}/></div>
    )
  }
}

class RecRoute extends React.Component {
  render() {
    return (
      <LoadPageData id={this.props.match.params.sessionID}>
        <SingleRec/>
      </LoadPageData>
    )
  }
}

class LoadPageData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.attrs = ['id', 'q', 'page']
  }
  componentDidMount() {
    this.get(this.props);
  }
  componentWillReceiveProps(nextProps) {
    for (var i in this.attrs) {
      var a = this.attrs[i];
      if (this.props[a] !== nextProps[a]) {
        this.get(nextProps);
        return;
      }
    }
  }
  get(props) {
    var url = "/sessions";
    this.setState({loading: true, data: null})

    var args = {}
    this.attrs.forEach((a) => {
      if (props[a]) {
        args[a] = props[a];
      }
    })
    args['limit'] = 9;

    jquery.getJSON(url, args).then((d) => {
      this.setState({data: d})
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
    if (this.state.data) {
      var children = this.props.children
      var childrenWithProps = React.Children.map(children, child => React.cloneElement(child, {data: this.state.data}))
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
    return (<Session session={this.props.data.sessions[0]}/>)
  }
}

class SearchInput extends Component {
  search = (e, q) => {
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
        <input hintText="Search" onChange={this.search}/>
        <button onClick={this.doSearch}>Search</button>
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
      </div>
    )
  }
}

class App extends Component {
  //<Route path="/" component={SearchInput}/>

  render() {
    return (
      <Router>

        <Switch>
          <Route path="/r/:sessionID/:recordingID" component={RecRoute}/>
          <Route path="/search/:search" component={Search}/>
          <Route path="/page/:page" component={RoutePage}/>
          <Route path="*" component={PageRedirect}/>
        </Switch>

      </Router>
    );
  }
}

class PageRedirect extends React.PureComponent {
  render() {
    return (<Redirect to="/page/1"/>)
  }
}

class PaginatedSessions extends React.PureComponent {
  changePage = (page) => {
    this.props.history.push("/page/" + (page.selected + 1));
  }

  render() {
    var data = this.props.data;
    var pages = Math.ceil(data.count / data.limit);
    var pagination = null;
    //{"Page " + this.props.page + " of " + pages}
    if (pages > 1) {
      pagination = (
        <div>
          <ReactPaginate forcePage={this.props.page - 1} breakLabel={< a > ...</a>} breakClassName="break-me" containerClassName="pagination justify-content-center" pageClassName="page-item" pageLinkClassName="page-link" activeClassName="active" pageCount={pages} display={10} current={this.props.page} onPageChange={this.changePage}/>
        </div>
      )
    }

    return (
      <div>
        <Sessions sessions={data.sessions}/> <hr/>{pagination}
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
