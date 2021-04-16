import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

type Props = {
  monaco: any;
  enabled: boolean;
  error: Function;
  forking: Function;
};

type Language = { id: string };

function setLanguage(language: string, monaco: any) {
  const model = monaco.editor.getModels()[0];
  monaco.editor.setModelLanguage(model, language);
}

function createPost(monaco: any, error: Function) {
  const data = new FormData();
  const origin = document.location.origin;
  const model = monaco.editor.getModels()[0];
  data.append('language', model.getModeId());
  data.append('content', model.getValue());
  fetch(`${origin}/api/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: data,
  })
    .then(async (r) => {
      if (r.status >= 400) return Promise.reject(r);
      const response = await r.json();
      document.location.href = `/view/${response.id}`;
    })
    .catch(async (r) => {
      try {
        const res = await r.json();
        error(
          `An error occurred creating the post (${r.status} - ${res.error})`
        );
      } catch (_) {
        error(
          `An error occurred creating the post (${r.status} - Unauthorized)`
        );
      }
    });
}

export default function Navbar({ monaco, enabled, error, forking }: Props) {
  return (
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      {enabled ? (
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="select is-dark">
              <select onChange={(e) => setLanguage(e.target.value, monaco)}>
                {monaco.languages
                  .getLanguages()
                  .map((l: Language, i: number) => (
                    <option key={i} value={l.id}>
                      {l.id.toUpperCase()}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="navbar-item">
            <button
              className="button is-success"
              onClick={() => createPost(monaco, error)}>
              <i className="fa fa-paper-plane"></i> Create
            </button>
          </div>
        </div>
      ) : (
        <div className="navbar-end">
          <div className="navbar-item">
            <button className="button is-success" onClick={() => forking(true)}>
              <i className="fa fa-code-branch"></i> Fork
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
