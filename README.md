# `bluesky-replies`

A Web Component to display Bluesky post replies

**[Demo](https://daviddarnes.github.io/bluesky-replies/demo.html)** | **[Further reading](https://darn.es/bluesky-replies-web-component/)**

## Examples

General usage example:

```html
<script type="module" src="bluesky-replies.js"></script>

<bluesky-replies>
  <a href="https://bsky.app/profile/darn.es/post/3laucrkat3s2c">
    Discuss on Bluesky
  </a>
</bluesky-replies>
```

Example usage combined with [`bluesky-post`](https://darn.es/bluesky-post-web-component/):

```html
<script type="module" src="bluesky-replies.js"></script>
<script type="module" src="bluesky-post.js"></script>

<bluesky-replies>
  <bluesky-post>
    <a href="https://bsky.app/profile/darn.es/post/3laucrkat3s2c">
      Discuss on Bluesky
    </a>
  </bluesky-post>
</bluesky-replies>
```

Example using a custom template:

```html
<script type="module" src="bluesky-replies.js"></script>

<template id="bluesky-replies-template">
  <ul>
    <li data-key="reply">
      <details>
        <summary data-key="author.handle"></summary>
        <span data-key="record.text"></span>
      </details>
    </li>
  </ul>
</template>

<bluesky-replies>
  <a href="https://bsky.app/profile/darn.es/post/3laucrkat3s2c">
    Discuss on Bluesky
  </a>
</bluesky-replies>
```

## Features

This Web Component allows you to:

- Turn a regular Bluesky post link into a list of replies to that post
- Surface reply metadata alongside the reply, e.g. reply count, repost count, like count
- Use a custom template for all instances of the component on the page using a `data-key="name"` data attributes
- Use a custom template for specific instances using the `template` attribute
- Retrieve nested data using the `data-key` attribute and typical JavaScript key referencing, e.g. `data-key="reocrd.text"`

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@daviddarnes/bluesky-replies): `npm install @daviddarnes/bluesky-replies`
1. [Download the source manually from GitHub](https://github.com/daviddarnes/bluesky-replies/releases) into your project.
1. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)

### Usage

Make sure you include the `<script>` in your project (choose one of these):

```html
<!-- Host yourself -->
<script type="module" src="bluesky-replies.js"></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://www.unpkg.com/@daviddarnes/bluesky-replies@1.0.0/bluesky-replies.js"
></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://esm.sh/@daviddarnes/bluesky-replies@1.0.0"
></script>
```

### Using a custom template

The default template for the component looks like this:

```html
<ul>
  <li data-key="reply">
    <figure>
      <figcaption>
        <cite data-key="author.displayName"></cite>
      </figcaption>
      <blockquote data-key="record.text"></blockquote>
    </figure>
  </li>
</ul>
```

However you can customise the template by using a `<template>` element with an `id` of `bluesky-replies-template`, which will be used for every instance of the component on the page. Here's an example which just exposes the vanity metrics of the Bluesky post as a `<dl>`:

```html
<template id="bluesky-replies-template">
  <ul>
    <li data-key="reply">
      <details>
        <summary data-key="author.handle"></summary>
        <span data-key="record.text"></span>
      </details>
    </li>
  </ul>
</template>
```

You can also use different templates on the same page by using the `template` attribute to target `<template>` elements with a specific `id`:

```html
<template id="custom-template">
  <ul>
    <li data-key="reply">
      <strong data-key="author.displayName"></strong>
      <span data-key="record.text"></span>
    </li>
  </ul>
</template>

<bluesky-replies template="custom-template">
  <a href="https://bsky.app/profile/darn.es/post/3laucrkat3s2c">
    Discuss on Bluesky
  </a>
</bluesky-replies>
```

Data is applied using a `data-key` data attribute. The value of this attribute should correspond to a data point within a [Bluesky public post API response](https://docs.bsky.app/docs/api/app-bsky-feed-get-posts). The official Bluesky documentation has [an example of a status response here](https://docs.bsky.app/docs/api/app-bsky-feed-get-posts#responses).

The only `data-key` value unique to `bluesky-replies` is the `reply` value, which denotes the element which will be used to iterate for each reply, which will often be an `li` element or similar.

_Note that for `<a>` and `<img>` elements the value won't be applied to it's content if the string being returned starts with `http` and instead will be applied to the `href` and `src` attributes respectively._

Check out the [custom template demo](https://daviddarnes.github.io/bluesky-replies/demo-custom-template.html) as well as [the source code](https://github.com/daviddarnes/bluesky-replies/blob/main/demo-custom-template.html) for reference.

## Credit

With thanks to the following people:

- [Zach Leatherman](https://zachleat.com) for inspiring this [Web Component repo template](https://github.com/daviddarnes/component-template)
