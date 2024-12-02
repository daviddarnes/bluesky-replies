const blueskyThreadTemplate = document.createElement("template");

blueskyThreadTemplate.innerHTML = `
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
  `;

blueskyThreadTemplate.id = "bluesky-replies-template";

if (!document.getElementById(blueskyThreadTemplate.id)) {
  document.body.appendChild(blueskyThreadTemplate);
}

class BlueskyReplies extends HTMLElement {
  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "bluesky-replies", BlueskyReplies);
    }
  }

  async connectedCallback() {
    const replies = await this.data();

    this.renderSlots(replies);

    const { slots } = this;

    const replySlots = slots.filter((slot) => slot.dataset.key === "reply");

    replySlots.map((replySlot, index) => {
      let data = replies[index].post;

      const postSlots = slots.filter(
        (slot) => replySlot.contains(slot) && slot !== replySlot
      );

      postSlots.forEach((slot) => {
        slot.dataset.key.split(",").forEach((keyItem) => {
          const value = this.getValue(keyItem, data);
          if (keyItem === "record.text") {
            slot.innerHTML = value.replace(/\n/g, "<br/>");
          } else {
            this.populateSlot(slot, value);
          }
        });
      });
    });
  }

  populateSlot(slot, value) {
    if (typeof value == "string" && value.startsWith("http")) {
      if (slot.localName === "img") slot.src = value;
      if (slot.localName === "a") slot.href = value;
    } else {
      slot.textContent = value;
    }
  }

  handleKey(object, key) {
    const parsedKeyInt = parseFloat(key);

    if (Number.isNaN(parsedKeyInt)) {
      return object[key];
    }

    return object[parsedKeyInt];
  }

  getValue(string, data) {
    let keys = string.trim().split(/\.|\[|\]/g);
    keys = keys.filter((string) => string.length);

    const value = keys.reduce(
      (object, key) => this.handleKey(object, key),
      data
    );
    return value;
  }

  renderSlots(replies) {
    if (replies.length) {
      this.append(this.template);

      const replyTemplate = this.querySelector("[data-key='reply']");

      replies.slice(1).map(() => {
        const template = replyTemplate.cloneNode(true);
        replyTemplate.parentNode.append(template);
      });
    }
  }

  get template() {
    return document
      .getElementById(
        this.getAttribute("template") || `${this.localName}-template`
      )
      .content.cloneNode(true);
  }

  get slots() {
    return [...this.querySelectorAll("[data-key]")];
  }

  get link() {
    return this.querySelector("a").href;
  }

  get linkData() {
    const url = new URL(this.link);
    const paths = url.pathname.split("/").filter((string) => string.length);

    return {
      url: this.link,
      hostname: url.hostname,
      username: paths[paths.indexOf("profile") + 1],
      postId: paths[paths.length - 1],
    };
  }

  get userData() {
    return fetch(
      `https://public.api.${this.linkData.hostname}/xrpc/app.bsky.actor.getProfile?actor=${this.linkData.username}`
    ).then((response) => response.json());
  }

  async data() {
    const user = await this.userData;

    const data = await fetch(
      `https://public.api.${this.linkData.hostname}/xrpc/app.bsky.feed.getPostThread?uri=at://${user.did}/app.bsky.feed.post/${this.linkData.postId}`
    ).then((response) => response.json());

    return data.thread.replies;
  }
}

BlueskyReplies.register();
