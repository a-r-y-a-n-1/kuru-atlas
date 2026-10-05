import { fetchPlaceImage } from '../api/images.js';

export class DetailPanel {
  constructor(panelElement, options = {}) {
    this.panel = panelElement;
    this.onClose = options.onClose || (() => {});
    this.onNavigate = options.onNavigate || (() => {});
    this.currentPlace = null;
    this.imageLoadToken = 0; // Guard against race conditions when quickly clicking between places

    this.initElements();
    this.setupListeners();
  }

  initElements() {
    this.closeBtn = this.panel.querySelector('.panel-close-btn');
    this.mediaContainer = this.panel.querySelector('.panel-media');
    this.mediaImg = this.panel.querySelector('.panel-media-img');
    this.mediaSkeleton = this.panel.querySelector('.media-skeleton');
    this.mediaPlaceholder = this.panel.querySelector('.media-placeholder');
    this.imageCredit = this.panel.querySelector('.panel-image-credit');
    
    this.storyNum = this.panel.querySelector('.panel-story-num');
    this.title = this.panel.querySelector('.panel-title');
    this.modernLoc = this.panel.querySelector('.panel-modern-loc');
    this.identification = this.panel.querySelector('.panel-identification');
    this.narrative = this.panel.querySelector('.panel-narrative');

    this.metaParva = this.panel.querySelector('.meta-val-parva');
    this.metaRef = this.panel.querySelector('.meta-val-ref');
    this.metaEvent = this.panel.querySelector('.meta-val-event');
    this.metaCharacters = this.panel.querySelector('.meta-val-characters');

    this.prevBtn = this.panel.querySelector('.btn-prev-story');
    this.nextBtn = this.panel.querySelector('.btn-next-story');
  }

  setupListeners() {
    this.closeBtn.addEventListener('click', () => {
      this.close();
      this.onClose();
    });

    this.prevBtn.addEventListener('click', () => {
      this.onNavigate('prev');
    });

    this.nextBtn.addEventListener('click', () => {
      this.onNavigate('next');
    });
  }

  open(place, index, total, prevPlace, nextPlace) {
    if (!place) return;
    this.currentPlace = place;
    this.imageLoadToken++;
    const currentToken = this.imageLoadToken;

    // Reset scroll to top
    const content = this.panel.querySelector('.panel-content');
    if (content) content.scrollTop = 0;

    // Populate story index & titles
    const formattedSeq = String(index + 1).padStart(2, '0');
    this.storyNum.textContent = `Chronological Sequence · ${formattedSeq} of ${total}`;
    this.title.textContent = place.name;
    this.modernLoc.textContent = place.modernLocation;

    // Identification note with scholarly precision
    this.renderIdentification(place.identificationNote);

    // Narrative paragraphs
    this.narrative.innerHTML = '';
    const paragraphs = place.description.split('\n\n').filter(Boolean);
    paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text.trim();
      this.narrative.appendChild(p);
    });

    // Metadata block
    this.metaParva.textContent = place.parva;
    this.metaRef.textContent = place.chapterRef;
    this.metaEvent.textContent = place.event;

    // Characters tags
    this.metaCharacters.innerHTML = '';
    (place.characters || []).forEach(char => {
      const tag = document.createElement('span');
      tag.className = 'character-tag';
      tag.textContent = char;
      this.metaCharacters.appendChild(tag);
    });

    // Prev / Next Navigation buttons
    if (prevPlace) {
      this.prevBtn.disabled = false;
      this.prevBtn.innerHTML = `&larr; ${prevPlace.name}`;
      this.prevBtn.setAttribute('aria-label', `Previous: ${prevPlace.name}`);
    } else {
      this.prevBtn.disabled = true;
      this.prevBtn.innerHTML = `&larr; Beginning`;
    }

    if (nextPlace) {
      this.nextBtn.disabled = false;
      this.nextBtn.innerHTML = `${nextPlace.name} &rarr;`;
      this.nextBtn.setAttribute('aria-label', `Next: ${nextPlace.name}`);
    } else {
      this.nextBtn.disabled = true;
      this.nextBtn.innerHTML = `Conclusion &rarr;`;
    }

    // Prepare image state: calm skeleton
    this.mediaImg.classList.remove('is-loaded');
    this.mediaImg.removeAttribute('src');
    this.mediaImg.removeAttribute('alt');
    this.mediaSkeleton.classList.remove('is-hidden');
    this.mediaPlaceholder.style.display = 'none';
    this.imageCredit.textContent = '';

    // Slide panel in
    this.panel.classList.add('is-open');

    // Fetch and load runtime image
    this.loadImage(place, currentToken);
  }

  renderIdentification(note) {
    this.identification.className = 'panel-identification';
    if (!note) {
      this.identification.textContent = '';
      return;
    }

    if (note === 'Archaeologically supported') {
      this.identification.textContent = 'Archaeologically supported identification';
      this.identification.classList.remove('is-uncertain');
    } else if (note === 'Disputed') {
      this.identification.textContent = 'Location disputed among historical & regional traditions';
      this.identification.classList.add('is-uncertain');
    } else {
      // Traditional identification
      this.identification.textContent = 'Traditional literary identification · unverified by excavation';
      this.identification.classList.add('is-uncertain');
    }
  }

  async loadImage(place, token) {
    try {
      const result = await fetchPlaceImage(place);
      if (token !== this.imageLoadToken) return; // Stale request

      if (result && result.url) {
        const testImg = new Image();
        testImg.onload = () => {
          if (token !== this.imageLoadToken) return;
          this.mediaImg.src = result.url;
          this.mediaImg.alt = `${place.name} — ${result.title || 'Historical representation'}`;
          this.mediaImg.classList.add('is-loaded');
          this.mediaSkeleton.classList.add('is-hidden');
          this.mediaPlaceholder.style.display = 'none';
          this.imageCredit.textContent = result.credit || 'Wikimedia Commons';
        };
        testImg.onerror = () => {
          if (token !== this.imageLoadToken) return;
          this.showTypographicFallback(place);
        };
        testImg.src = result.url;
      } else {
        this.showTypographicFallback(place);
      }
    } catch {
      if (token !== this.imageLoadToken) return;
      this.showTypographicFallback(place);
    }
  }

  showTypographicFallback(place) {
    this.mediaSkeleton.classList.add('is-hidden');
    this.mediaImg.classList.remove('is-loaded');
    this.mediaPlaceholder.style.display = 'flex';
    this.mediaPlaceholder.querySelector('.placeholder-name').textContent = place.name;
    this.mediaPlaceholder.querySelector('.placeholder-note').textContent = 
      `ARCHIVAL ARCHIVE · ${place.lat.toFixed(2)}° N, ${place.lng.toFixed(2)}° E`;
    this.imageCredit.textContent = 'Archival cartographic record';
  }

  close() {
    this.panel.classList.remove('is-open');
    this.currentPlace = null;
    this.imageLoadToken++;
  }

  isOpen() {
    return this.panel.classList.contains('is-open');
  }
}
