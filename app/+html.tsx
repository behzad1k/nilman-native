import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>

      <meta name="title" content="Nilman - Beauty Service Provider"/>
      <meta name="description" content="Online beauty service provider"/>

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover, interactive-widget=resizes-content"
      />

      <meta name="theme-color" content="#c89dc7"/>
      <meta name="mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <meta name="apple-mobile-web-app-title" content="Nilman"/>

      <meta property="og:type" content="website"/>
      <meta property="og:url" content="https://app.nilman.co/"/>
      <meta property="og:title" content="Nilman - Beauty Service Provider"/>
      <meta property="og:description" content="Online beauty service provider"/>
      <meta property="og:image" content="./newLogo.png"/>

      <meta property="twitter:card" content="summary_large_image"/>
      <meta property="twitter:url" content="https://app.nilman.co/"/>
      <meta property="twitter:title" content="Nilman - Beauty Service Provider"/>
      <meta property="twitter:description" content="Online beauty service provider"/>
      <meta property="twitter:image" content="./newLogo.png"/>

      <ScrollViewStyleReset/>
    </head>
    <body>
    {children}
    </body>
    </html>
  );
}