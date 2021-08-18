import React from 'react';
// import ReactDOM from 'react-dom';
// import StopwatchDisplay from './StopwatchDisplay.jsx';

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      running: false,
      currentTimeMs: 0,
      currentTimeSec: 0,
      currentTimeMin: 0,
      currentTimeHrs: 0
    };
  }
  
  componentWillUnmount() {
    clearInterval(this.watch)
  }
  
  start = () => {
    if (!this.state.running) {
      this.setState({ running: true });
      this.watch = setInterval(() => this.pace(), 10);
    }
  };
  
  stop = () => {
    this.setState({ running: false });
    clearInterval(this.watch);
  };
  
  pace = () => {
    this.setState({ currentTimeMs: this.state.currentTimeMs + 10 });
    if (this.state.currentTimeMs >= 1000) {
      this.setState({ currentTimeSec: this.state.currentTimeSec + 1, currentTimeMs: 0 });
    }
    if (this.state.currentTimeSec >= 60) {
      this.setState({ currentTimeMin: this.state.currentTimeMin + 1, currentTimeSec: 0 });
    }
    if (this.state.currentTimeMin >= 60) {
      this.setState({ currentTimeHrs: this.state.currentTimeHrs + 1, currentTimeMin: 0})
    }
  };
  
  reset = () => {
    this.setState({
      currentTimeMs: 0,
      currentTimeSec: 0,
      currentTimeMin: 0,
      currentTimeHrs: 0
    });
  };
  
  render() {
    return (
      <div className={'stopwatch'}>
        {/*{this.state.running === false && (*/}
        {/*  <button onClick={this.start}>START</button>*/}
        {/*)}*/}
        {/*{this.state.running === true && (*/}
        {/*  <button onClick={this.stop}>STOP</button>*/}
        {/*)}*/}
        {(`0${this.state.currentTimeHrs}`).slice(-2)}:{(`0${ this.state.currentTimeMin }`.slice(-2))}:{(`0${this.state.currentTimeSec}`).slice(-2)}
        {/*<button onClick={this.reset}>RESET</button>*/}
        {/*<StopwatchDisplay*/}
        {/*  ref="display"*/}
        {/*  {...this.state}*/}
        {/*  formatTime={this.formatTime}*/}
        {/*/>*/}
      </div>
    );
  }
}

export default Stopwatch;
