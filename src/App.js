import React, {Component} from 'react';
//import './App.css';
import './paginate.css';
import 'video.js/dist/video-js.css'
import jquery from 'jquery'
import videojs from 'video.js'
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
    if (this.state.showVideo) { video = <iframe title={this.props.recording.youtube_url} width="560" height="315" src={this.props.recording.youtube_url} frameBorder="0" allowFullScreen></iframe>
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

class VideoPlayerYoutube extends React.PureComponent {
  render() {
    var r = this.props.recording;

    return (
      <iframe title={r.youtube_url} width="560" height="315" src={r.youtube_url} frameBorder="0" allowFullScreen></iframe>
    )
  }
}

class VideoPlayerSelfHosted extends React.PureComponent {
  render() {
    var r = this.props.recording;
    var video_url = 'http://s3.amazonaws.com/onlinehomilies_videos/' + r.youtube_id + ".mp4";

    return (
      <video preload='none' poster="http://washucsc.org/test.jpg" controls>
        <source src={video_url}/>
      </video>
    )
  }
}

class VideoPlayerSelfHostedVideoJS extends React.Component {
  componentDidMount() {
    var r = this.props.recording
    var video_url = r.video_url
    var sources = [
      {
        src: video_url,
        type: 'video/mp4'
      }
    ]
    var options = {
      controls: true,
      sources: sources,
      poster: r.poster_url,
      fluid: true
    }
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
  }
  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }
  render() {

    return (
      <div data-vjs-player>
        <video ref={node => this.videoNode = node} className='video-js'/>
      </div>
    )
  }
}

class AudioPlayer extends React.PureComponent {
  render() {
    var r = this.props.recording
    return (
      <div>
        <a href={r.audio_url}>Audio Link</a>
        <audio preload='none' controls>
          <source src={r.audio_url}/>
        </audio>
      </div>
    )
  }
}

class Recording extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  toggleTranscription = () => {
    this.setState({
      show_transcription: !this.state.show_transcription
    })
  }
  render() {
    var r = this.props.recording;

    var inner_content = (
      <div>
        <h1>{r.title}</h1>
        <h2>{r.speaker}</h2>
      </div>
    )

    if (this.props.showVideo) {
      var media = null
      if (r.youtube_url || r.video_url) {
        if (r.youtube_url) {
          media = (
            <div>
              <VideoPlayerYoutube recording={r}/>
            </div>
          )
        } else {
          media = (<VideoPlayerSelfHostedVideoJS recording={r}/>)
        }
      } else if (r.audio_url) {
        media = (<AudioPlayer recording={r}/>)
      } else {
        media = (
          <div>Something is wrong and the media is not available. Please contact John Aughey at jha@aughey.com.</div>
        )
      }

      if (this.state.show_transcription) {
        var transcription = (
          <div class="transcription card">
            <h1>Transcription</h1>
            <p>Note: This transcription was created by a computer and is only approximate. This should be used purely as a textual reference.</p>
            <p>{r.transcription}</p>
          </div>
        )
      } else if (r.transcription) {
        var transcription = (
          <button onClick={this.toggleTranscription} className='btn'>Show Transcription</button>
        )
      }

      if (r.wordcloud_image) {
        var wordcloud = (
          <div><img src={r.wordcloud_image} alt="wordcloud"/></div>
        )
      }

      return (
        <div className="recording text-center">
          {inner_content}
          {media}
          <div>
            <a href={r.audio_url}>Audio only MP3 Download</a>
          </div>
          {wordcloud}
          {transcription}
          <br/>
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
          <div className='bottom'>
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
      <div key={s._id} className="col-lg-4 col-sm-8"><Session session={s} background={i % 8}/></div>
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

class OldSessionRoute extends React.Component {
  render() {
    return (
      <LoadPageData old_session_id={this.props.match.params.sessionID}>
        <SingleRec/>
      </LoadPageData>
    )
  }
}


class LoadPageData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.attrs = ['old_session_id','id', 'q', 'page']
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
    var url = "/api/sessions";
    this.setState({loading: true, data: null})

    var timeout = setTimeout(() => {
      this.setState({too_long: true})
    }, 1000);

    var args = {}
    this.attrs.forEach((a) => {
      if (props[a]) {
        args[a] = props[a];
      }
    })
    args['limit'] = 9;

    jquery.getJSON(url, args).then((d) => {
      this.setState({data: d})
      //console.log(d);
      //this.setState(d)
      //return d;
    }).fail(() => {
      this.setState({error: "Error: couldn't retrieve recordings.  Please contact John Aughey jha@aughey.com"})
    }).always(() => {
      this.setState({loading: false, too_long: false});
      clearTimeout(timeout);
    });
  }
  render() {
    if (this.state.too_long) {
      return (
        <div><img alt="loading" src="/ajax-loader.gif"/></div>
      )
    }
    if (this.state.error) {
      return (
        <div>{this.state.error}</div>
      )
    } else if (this.state.data) {
      var children = this.props.children
      var childrenWithProps = React.Children.map(children, child => React.cloneElement(child, {data: this.state.data}))
      return (
        <div>{childrenWithProps}</div>
      )
    } else {
      return (
        <div></div>
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

class SearchInput extends Component {
  search = (e) => {
    this.q = e.target.value;
  }
  testSubmit = (e) => {
    if (e.key === 'Enter') {
      this.doSearch()
    }
  }
  doSearch = () => {
    this.props.history.push("/search/" + this.q);
  }
  render() {
    return (
      <div>
        <input placeholder="Search Words" onKeyPress={this.testSubmit} onChange={this.search}/>
        <button onClick={this.doSearch}>Search</button>
      </div>
    )
  }
}

class Search extends React.PureComponent {
  render() {
    var params = this.props.match.params;
    if(params.page) {
      var page = params.page
    } else {
      var page = 1
    }
    return (
      <div>
        <div>Search Term: {params.search}</div>
        <SearchInput history={this.props.history}/>
        <LoadPageData page={page} q={params.search}>
          <PaginatedSessions prefix={"/search/" + params.search}  history={this.props.history} page={page}/>
        </LoadPageData>
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
          <Route path="/r/:sessionID/:recordingID.html" component={RecRoute}/>
          <Route path="/search/:search/page/:page" component={Search}/>
          <Route path="/search/:search" component={Search}/>
          <Route path="/page/:page" component={RoutePage}/>
          <Route path="/sessions/:sessionID" component={OldSessionRoute}/>
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
    var prefix = this.props.prefix
    if(!prefix) {
      prefix = ""
    }
    this.props.history.push(prefix + "/page/" + (page.selected + 1));
  }

  render() {
    var data = this.props.data;

    if (data.count === 0) {
      return (
        <div>No results found</div>
      )
    }

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
        <Sessions sessions={data.sessions}/>
        <hr/>{pagination}
      </div>
    )
  }
}

class RoutePage extends Component {
  render() {
    //console.log(this.props);
    var page = this.props.match.params.page;
    return (
      <div>
        <SearchInput history={this.props.history}/>
        <LoadPageData page={page}>
          <PaginatedSessions history={this.props.history} page={page}/>
        </LoadPageData>
      </div>
    )
  }
}

export default App;
