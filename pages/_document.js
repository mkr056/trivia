import {Html, Head, Main, NextScript} from 'next/document';

/**
 * A custom Document component is used to update the <html> and <body> tags used to render a Page.
 * @returns {JSX.Element} The custom Document component (custom Html).
 */

// I override the default behaviour in order to add Bootstrap via a CDN link.
export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH'
          crossOrigin='anonymous'
        />
      </Head>
      <body>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
}