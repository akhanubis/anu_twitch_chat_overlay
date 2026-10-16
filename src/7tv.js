const API_BASE = 'https://7tv.io/v3';
const CDN_BASE = 'https://cdn.7tv.app';

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getChannelNameFromLocation = doc => {
  const match = (doc.location && doc.location.href || '').match(/\/popout\/([^/]+)\/chat/);
  return match ? decodeURIComponent(match[1]) : null;
};

const pickBestImage = emote => {
  // 7TV emote data shape can vary; prefer host.files when available
  const host = (emote && emote.data && emote.data.host) || {};
  const files = (emote && emote.data && emote.data.host && emote.data.host.files) || [];
  const preferred = files
    .slice()
    .sort((a, b) => {
      const aMatch = (a.name || '').match(/(\d+)x/);
      const bMatch = (b.name || '').match(/(\d+)x/);
      const aWeight = aMatch ? parseInt(aMatch[1], 10) : 0;
      const bWeight = bMatch ? parseInt(bMatch[1], 10) : 0;
      return bWeight - aWeight;
    })
    .find(file => /(?:webp|gif|png)$/i.test(file.name || '')) || { name: '1x.webp' };

  const hostUrl = (host.url || CDN_BASE).replace(/\/$/, '');
  const fileName = preferred.name || '1x.webp';
  const ext = fileName.split('.').pop().toLowerCase();
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  // 7tv CDN common pattern: {host}/emote/{id}/{size}.{ext}
  return `${hostUrl}/emote/${emote.id}/${baseName}.${ext}`;
};

const buildEmoteMap = (emotes = []) => {
  const map = {};
  for (const emote of emotes) {
    if (!emote || !emote.name) continue;
    map[emote.name] = {
      id: emote.id,
      url: pickBestImage(emote),
      animated: Boolean(emote.animated || (emote.data && emote.data.animated))
    };
  }
  return map;
};

const fetchJson = async url => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
};

const loadGlobalEmotes = async () => {
  const data = await fetchJson(`${API_BASE}/emote-sets/global`);
  if (!data || !Array.isArray(data.emotes)) return {};
  return buildEmoteMap(data.emotes);
};

const loadChannelEmotes = async channelName => {
  if (!channelName) return {};
  const user = await fetchJson(`${API_BASE}/users/twitch/${encodeURIComponent(channelName)}`);
  const setId = user && user.emote_set && user.emote_set.id;
  if (!setId) return {};
  const data = await fetchJson(`${API_BASE}/emote-sets/${setId}`);
  if (!data || !Array.isArray(data.emotes)) return {};
  return buildEmoteMap(data.emotes);
};

const ensureImageStyles = doc => {
  const style = doc.createElement('style');
  style.id = 'tco-7tv-style';
  style.textContent = `
    .tco-7tv-emote {
      display: inline-block;
      vertical-align: text-bottom;
      margin: 0 1px;
      max-height: 1.5em;
      width: auto;
      object-fit: contain;
      pointer-events: none;
    }
  `;
  if (!doc.head) return;
  doc.head.appendChild(style);
};

const replaceTextWithEmotes = (root, emoteMap) => {
  if (!root || !root.ownerDocument || !emoteMap || !Object.keys(emoteMap).length) return;

  const keys = Object.keys(emoteMap)
    .filter(name => name && name.length)
    .sort((a, b) => b.length - a.length);

  if (!keys.length) return;

  const tokenRegex = new RegExp(`(${keys.map(escapeRegex).join('|')})`, 'g');

  const walk = node => {
    if (!node || !node.nodeType) return;
    if (node.nodeType !== Node.TEXT_NODE) {
      if (node.childNodes) {
        for (const child of Array.from(node.childNodes)) walk(child);
      }
      return;
    }

    const text = node.textContent || '';
    if (!text || !tokenRegex.test(text)) return;

    const parent = node.parentNode;
    if (!parent) return;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    text.replace(tokenRegex, (match, offset) => {
      return match;
    });

    // We'll run a global exec loop to get indices
    let m;
    tokenRegex.lastIndex = 0;
    while ((m = tokenRegex.exec(text)) !== null) {
      const match = m[0];
      const offset = m.index;
      if (offset > lastIndex) fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
      const emoteInfo = emoteMap[match];
      if (emoteInfo) {
        const img = document.createElement('img');
        img.src = emoteInfo.url;
        img.alt = match;
        img.title = match;
        img.className = 'tco-7tv-emote';
        img.draggable = false;
        fragment.appendChild(img);
      } else {
        fragment.appendChild(document.createTextNode(match));
      }
      lastIndex = offset + match.length;
    }
    if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));

    parent.replaceChild(fragment, node);
  };

  walk(root);
};

const processChatLines = async doc => {
  const channelName = getChannelNameFromLocation(doc);
  const [globalEmotes, channelEmotes] = await Promise.all([
    loadGlobalEmotes(),
    loadChannelEmotes(channelName)
  ]);

  const merged = { ...globalEmotes, ...channelEmotes };
  if (!Object.keys(merged).length) return;

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes || []) {
        if (!node) continue;
        if (node.nodeType === Node.ELEMENT_NODE) {
          replaceTextWithEmotes(node, merged);
        } else if (node.nodeType === Node.TEXT_NODE) {
          replaceTextWithEmotes(node, merged);
        }
      }
    }
  });

  observer.observe(doc.body, { childList: true, subtree: true });

  const existingChat = doc.querySelectorAll('.chat-line__message, .text-fragment, .chat-line__message-container');
  for (const el of existingChat) replaceTextWithEmotes(el, merged);
};

const install7tvSupport = async doc => {
  if (!doc || !doc.body) return;
  ensureImageStyles(doc);

  // Avoid duplicate installs
  if (doc.__tco7tvInstalled) return;
  doc.__tco7tvInstalled = true;

  await processChatLines(doc);
};

module.exports = {
  install7tvSupport,
  loadGlobalEmotes,
  loadChannelEmotes
};
