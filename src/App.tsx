import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Viewport from './components/viewport';
import './App.css';

function intializeNewToken(func: Function) {
  fetch(`${document.location.origin}/auth/token`, { method: 'POST' })
    .then((r) => r.json())
    .then((j: any) => {
      localStorage.setItem('token', j.token);
      func(true);
    });
}

function App() {
  let [authorized, setAuthorized] = useState(false);

  if (!localStorage.getItem('token')) intializeNewToken(setAuthorized);
  if (localStorage.getItem('token') && !authorized) setAuthorized(true);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Viewport enabled={authorized} />
        </Route>
        <Route path="/view/:id">
          <Viewport enabled={false} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
