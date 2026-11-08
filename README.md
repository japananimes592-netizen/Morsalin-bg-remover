# Morsalin BG Remover

A purple-themed, browser-based background remover. Image processing is performed in the browser using the open-source `@imgly/background-removal` package; no API key or server is required. The AI package/model is downloaded from a CDN on first use, so an internet connection is required.

## Deploy to Netlify
1. Upload this project to a GitHub repository, preserving the `src` folder.
2. In Netlify choose **Add new site → Import an existing project**.
3. Select the GitHub repository.
4. This is a static site: leave the build command blank and set publish directory to `.`.
5. Deploy.

## Important
The background-removal package is distributed under AGPL-3.0. Review its licence and your obligations before commercial use or modifying/distributing the service. Third-party CDN/model availability and browser/device performance may vary.
