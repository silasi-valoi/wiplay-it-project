
import React, { Component } from 'react';

import {ModalOpener}   from "./containers/modal/modal-conf";





import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams
} from "react-router-dom";




// This example shows how to render two different screens
// (or the same screen in a different context) at the same URL,
// depending on how you got there.
//
// Click the "featured images" and see them full screen. Then
// "visit the gallery" and click on the colors. Note the URL and
// the component are the same as before but now we see them
// inside a modal on top of the gallery screen.

export default function ModalGalleryExample() {
  return (
    <Router>
      <ModalSwitch />
    </Router>
  );
}

function ModalSwitch() {
  let location = useLocation();


  // This piece of state is set when one of the
  // gallery links is clicked. The `background` state
  // is the location that we were at when one of
  // the gallery links was clicked. If it's there,
  // use it as the location for the <Switch> so
  // we show the gallery in the background, behind
  // the modal.
  let background = location.state && location.state.background;
  console.log(location, background)

  return (
    <div>
      <Switch location={background || location}>
          <Route exact path="/"   children={<Home/>}/>
          <Route path="/gallery/" children={<Gallery />} />
          <Route path="/img/:id/" children={<ImageView />} />
      
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && <Route path="/img/:id/" children={<Modal/>}/>}
    </div>
  );
}

const IMAGES = [
  { id: 0, title: "Dark Orchid", color: "DarkOrchid" },
  { id: 1, title: "Lime Green", color: "LimeGreen" },
  { id: 2, title: "Tomato", color: "Tomato" },
  { id: 3, title: "Seven Ate Nine", color: "#789" },
  { id: 4, title: "Crimson", color: "Crimson" }
];

function Thumbnail({ color }) {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        background: color
      }}
    />
  );
}

function Image({ color }) {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: color
      }}
    />
  );
}

export function Home() {
  return (
    <div>
      <Link to="/gallery/">Visit the Gallery</Link>
      <h2>Featured Images</h2>
      <ul>
        <li>
          <Link to="/img/2/">Tomato</Link>
        </li>
        <li>
          <Link to="/img/4/">Crimson</Link>
        </li>
      </ul>
    </div>
  );
}

export function Gallery() {
  let location = useLocation();

  return (
    <div>
      {IMAGES.map(i => (
        <Link
          key={i.id}
          to={{
            pathname: `/img/${i.id}/`,
            // This is the trick! This link sets
            // the `background` in location state.
            state: { background: location }
          }}
        >
          <Thumbnail color={i.color} />
          <p>{i.title}</p>
        </Link>
      ))}
    </div>
  );
}

export function ImageView() {
  let { id } = useParams();
  let image = IMAGES[parseInt(id, 10)];

  if (!image) return <div>Image not found</div>;

  return (
    <div>
      <h1>{image.title}</h1>
      <Image color={image.color} />
    </div>
  );
}


export function Modal(props) {
    let history = useHistory();
    console.log(props)
    
    let back = e => {
    e.stopPropagation();
    history.goBack();
   };

    return (
        <div>
          {ModalOpener.optionsMenuModal(props)}
        </div>
        )
   
}


/*
top: 25,
          left: "10%",
          right: "10%",
          padding: 15,
*/