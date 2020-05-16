import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';

const BRAND_ID = 'nav';
const SECTIONS = [
  'map',
  'announcements',
  'experiences',
  'chat',
 ];

export default function Header(props) {
  const [name, setName] = useState(props.name);
  const [section, setSection] = useState();
  const [editingName, setEditingName] = useState(false);

  function submitName(e) {
    setEditingName(false);
    e.preventDefault();
  }

  function editName() {
    setEditingName(true)
  }

  function cancelEditName() {
    setEditingName(false)
    setName(props.name)
  }

  return (
    <header id={BRAND_ID}>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navsections" aria-controls="navsections" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navsections">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            {SECTIONS.map(s => 
              <li className={"nav-item" + (section === s ? " active" : "")} key={s}>
                <a className="nav-link" onClick={() => setSection(s)} href={"#" + s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </a>
              </li>
            )}
          </ul>
          {editingName ?
            <form className="text-light form-inline my-2 my-lg-0" onSubmit={submitName}>
              <div className="d-flex flex-column mr-2">
                <label htmlFor="name">Name Others See:</label>
                <small >(delete to be invisible)</small>
              </div>
              <input autoFocus className="form-control mr-sm-2" type="text" placeholder="Name" aria-label="Name" value={name} onChange={e => setName(e.value)} onBlur={cancelEditName}/>
              <button className="btn btn-outline-success my-2 my-sm-0" type="small">
                Submit
              </button>
            </form>
          :
            <div className="text-light my-2 my-lg-0" onClick={editName}>
              <span className="mr-2" title="This is the name other guests see as you go into and out of rooms at the party.">
                {props.name ? props.name + " (click to change)" : "(Incognito - click to change)"}
              </span>
              <FontAwesomeIcon icon={props.name ? faUser : faUserSlash} />
            </div>
          }
        </div>
      </nav>
    </header>
  );
}