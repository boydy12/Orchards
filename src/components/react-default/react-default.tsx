import React, { useState, useEffect } from 'react';
import logo from './logo.svg';

interface ReactDefaultProps {
}

type Props = ReactDefaultProps;

const ReactDefault: React.FC<Props> = (props: Props) => {

	const [data, setData] = useState([]);


  async function getDemoData() {
    return (await fetch('https://my-json-server.typicode.com/typicode/demo/posts')).json()
  }

  useEffect(() => {
    const getData = async () => {
      const data = await getDemoData();
      console.log(data);
      setData(data);
    }
    getData();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


export default ReactDefault;