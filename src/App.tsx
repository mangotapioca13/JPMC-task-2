import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    // Only render the graph is the flag on state is true
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0;
    const timeInterval = setInterval(
      () => {
        DataStreamer.getData((serverResponds: ServerRespond[]) => {
          // Update the state by using the new data received from the server
          // and also toggle the graph flag to true
          this.setState({
            data: serverResponds,
            showGraph: true,
          });
        });

        // Increment x and stop when we reach over 1k
        x++;
        if (x > 1000)
          clearInterval(timeInterval);
      },
      100 // How frequently the interval is triggered (ms)
    );
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // Originally, when button is clicked, react app tries to request
            // new data from the server, but only loaded a few every click.
            
            // Now, once the button is clicked, the app will keep requesting
            // the data every 100ms until the app is closed or the server does
            // not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
