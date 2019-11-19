import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
	// Because of SSR, we have to check for the existence of ipcRenderer before use

	const handleImgClick = () => {
		console.log('messaging worker...')
		ipcRenderer && ipcRenderer.send('for-worker', 'message to worker');
	}
	useEffect(() => {
		// componentDidMount()
		if (ipcRenderer) {
			// Allow renderer process to receive communication
			ipcRenderer.on('to-renderer', (event, arg) => {
				console.log(arg)
				alert(arg)
			});

		}

		return () => {
			// componentWillUnmount()
			if (ipcRenderer) {
				// unregister it
				ipcRenderer.removeAllListeners('to-renderer');
			}
		};
	}, []);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-javascript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
        </p>
				<div>
	        <img onClick={handleImgClick} src="/static/logo.png" />
					<p>Click the logo to send a message to the worker.</p>
				</div>
      </div>
    </React.Fragment>
  );
};

export default Home;
