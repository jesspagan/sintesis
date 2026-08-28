import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';
import { Button } from './ui/button';
import { NotificationCounter } from './ui/notification-counter';
import { Bell } from './ui/bell';
import { Magnifier } from './ui/magnifier';
import { Flight } from './ui/flight';
import { ExternalLink, ExternalLinkMedium } from './ui/external-link';
import { Swap } from './ui/swap';
import { Trip } from './ui/trip';
import { Caret } from './ui/caret';
import { Calendar } from './ui/calendar';
import { Pax } from './ui/pax';
import { Feedback } from './ui/feedback';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div
        className='secondary'
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--leaf-spacing-16)' }}
      >
        <Button className='primary'>Skip to Main Content</Button>
        <Button className='primary'>Login</Button>
        <Button
          className='primary'
          disabled
        >
          Login
        </Button>
        <Button className='large primary'>Find Flights</Button>
        <Button
          aria-label='five notifications pending'
          className='icon-only transparent'
        >
          <Bell />
          <NotificationCounter count={5} />
        </Button>
        <Button
          aria-label='search'
          className='icon-only transparent'
        >
          <Magnifier />
        </Button>
        <Button
          aria-selected={false}
          role='tab'
        >
          <Flight className='icon-left' />
          Flights
        </Button>
        <Button
          disabled
          aria-selected={false}
          role='tab'
        >
          <Flight className='icon-left' />
          Flights
        </Button>
        <Button
          aria-selected={false}
          role='tab'
        >
          <Flight className='icon-left' />
          Flights
          <ExternalLink className='icon-right' />
        </Button>
        <Button
          aria-selected={false}
          disabled
          role='tab'
        >
          <Flight className='icon-left' />
          Flights
          <ExternalLink className='icon-right' />
        </Button>
        <Button
          aria-selected
          role='tab'
        >
          <Flight className='icon-left' />
          Flights
        </Button>
        <Button
          aria-selected
          disabled
          role='tab'
        >
          <Flight className='icon-left' />
          Flights
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--leaf-spacing-16)' }}>
        <Button aria-haspopup='true'>
          From<span className='secondary-content'>Origin</span>
        </Button>
        <Button aria-haspopup='true'>
          To<span className='secondary-content'>Destination</span>
        </Button>
        <Button className='icon-only primary-inverted'>
          <Swap />
        </Button>
        <Button
          className='wide'
          role='combobox'
        >
          <Trip />
          <span className='label'>Round Trip</span>
          <Caret />
        </Button>
        <Button
          className='wide'
          role='combobox'
        >
          <Calendar />
          <span className='label'>Depart - Return</span>
          <Caret />
        </Button>
        <Button role='combobox'>
          <Pax />
          <span className='label'>1</span>
          <Caret />
        </Button>
        <Button className='medium primary'>
          Learn More <ExternalLinkMedium />
        </Button>
      </div>
      <div
        className='secondary'
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--leaf-spacing-16)' }}
      >
        <Button className='secondary-control'>
          <Feedback />
          Feedback
        </Button>
      </div>
      <section id='center'>
        <div className='hero'>
          <img
            src={heroImg}
            className='base'
            width='170'
            height='179'
            alt=''
          />
          <img
            src={reactLogo}
            className='framework'
            alt='React logo'
          />
          <img
            src={viteLogo}
            className='vite'
            alt='Vite logo'
          />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type='button'
          className='counter'
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className='ticks'></div>

      <section id='next-steps'>
        <div id='docs'>
          <svg
            className='icon'
            role='presentation'
            aria-hidden='true'
          >
            <use href='/icons.svg#documentation-icon'></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a
                href='https://vite.dev/'
                target='_blank'
                rel='noreferrer noopener'
              >
                <img
                  className='logo'
                  src={viteLogo}
                  alt=''
                />
                Explore Vite
              </a>
            </li>
            <li>
              <a
                href='https://react.dev/'
                target='_blank'
                rel='noreferrer noopener'
              >
                <img
                  className='button-icon'
                  src={reactLogo}
                  alt=''
                />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id='social'>
          <svg
            className='icon'
            role='presentation'
            aria-hidden='true'
          >
            <use href='/icons.svg#social-icon'></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a
                href='https://github.com/vitejs/vite'
                target='_blank'
                rel='noreferrer noopener'
              >
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#github-icon'></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a
                href='https://chat.vite.dev/'
                target='_blank'
                rel='noreferrer noopener'
              >
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#discord-icon'></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a
                href='https://x.com/vite_js'
                target='_blank'
                rel='noreferrer noopener'
              >
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#x-icon'></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a
                href='https://bsky.app/profile/vite.dev'
                target='_blank'
                rel='noreferrer noopener'
              >
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#bluesky-icon'></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className='ticks'></div>
      <section id='spacer'></section>
    </>
  );
}

export default App;
