import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { monaco } from '@monaco-editor/react';
import Navbar from './navbar';
import Editor from './editor';

type Props = { enabled: boolean };
type Params = { id: string | undefined };

function fetchPost(id: string, monaco: any, error: Function) {
  fetch(`${document.location.origin}/api/fetch?id=${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
    .then(async (r) => {
      if (r.status >= 400) return Promise.reject(r);
      const response = await r.json();
      const model = monaco.editor.getModels()[0];
      monaco.editor.setModelLanguage(model, response.language);
      model.setValue(response.content);
    })
    .catch(async (r) => {
      try {
        const res = await r.json();
        error(
          `An error occurred getting the post (${r.status} - ${res.error})`
        );
      } catch (_) {
        error(
          `An error occurred getting the post (${r.status} - Unauthorized)`
        );
      }
    });
}

export default function Viewport({ enabled }: Props) {
  let [error, setError] = useState('');
  let [forking, setForking] = useState(false);
  let [instance, setInstance] = useState(null);
  let [fetched, setFetched] = useState(false);
  let { id } = useParams<Params>();

  monaco.init().then(async (m) => {
    const themeData = await import('monaco-themes/themes/Twilight.json');
    m.editor.defineTheme('twilight', themeData);
    m.editor.setTheme('twilight');
    setInstance(m);
  });

  if (instance) {
    if (id && localStorage.getItem('token')) {
      if (!fetched) {
        fetchPost(id, instance, setError);
        setFetched(true);
      }
    } else {
      const model = (instance as any).editor.getModels()[0];
      if (model.getValue() !== '') {
        model.setValue('');
        (instance as any).editor.setModelLanguage(model, 'plaintext');
      }
    }
  }

  return (
    <div>
      {instance && (
        <Navbar
          monaco={instance}
          enabled={enabled || forking}
          error={setError}
          forking={setForking}
        />
      )}
      {error !== '' && (
        <div className="notification is-light is-danger">{error}</div>
      )}
      <Editor enabled={enabled || forking} />
    </div>
  );
}
