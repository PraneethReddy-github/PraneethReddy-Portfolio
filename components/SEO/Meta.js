import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>Praneeth Reddy Portfolio</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Praneeth Reddy Portfolio" />
            <meta name="description"
                content="Praneeth Reddy's Personal Portfolio Website. Built with Ubuntu 20.04 (Linux) theme using Next.js and Tailwind CSS. Backend Engineer specializing in Go, distributed systems, and DevOps." />
            <meta name="author" content="Praneeth Reddy" />
            <meta name="keywords"
                content="praneeth reddy, praneeth portfolio, backend engineer, go developer, distributed systems, devops, ubuntu portfolio, linux portfolio, praneeth github" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />

            {/* Search Engine */}
            <meta name="image" content="images/logos/icons8-pixel-cat-50.png" />
            {/* Schema.org for Google */}
            <meta itemProp="name" content="Praneeth Reddy Portfolio" />
            <meta itemProp="description"
                content="Praneeth Reddy's Personal Portfolio Website. Built with Ubuntu 20.04 (Linux) theme using Next.js and Tailwind CSS." />
            <meta itemProp="image" content="images/logos/icons8-pixel-cat-50.png" />
            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Praneeth Reddy Portfolio" />
            <meta name="twitter:description"
                content="Praneeth Reddy's Personal Portfolio Website. Built with Ubuntu 20.04 (Linux) theme using Next.js and Tailwind CSS." />
            <meta name="twitter:site" content="praneeth_rdy" />
            <meta name="twitter:creator" content="praneeth_rdy" />
            <meta name="twitter:image:src" content="images/logos/icons8-pixel-cat-100.png" />
            {/* Open Graph general (Facebook, Pinterest & Google+) */}
            <meta name="og:title" content="Praneeth Reddy Portfolio" />
            <meta name="og:description"
                content="Praneeth Reddy's Personal Portfolio Website. Built with Ubuntu 20.04 (Linux) theme using Next.js and Tailwind CSS." />
            <meta name="og:image" content="images/logos/icons8-pixel-cat-100.png" />
            <meta name="og:url" content="https://praneeth-rdy.github.io/" />
            <meta name="og:site_name" content="Praneeth Reddy Personal Portfolio" />
            <meta name="og:locale" content="en_IN" />
            <meta name="og:type" content="website" />

            <link rel="icon" href="images/logos/icons8-pixel-cat-ios-17-filled-32.png" />
            <link rel="apple-touch-icon" href="images/logos/icons8-pixel-cat-ios-17-filled-96.png" />
        </Head>
    )
}
