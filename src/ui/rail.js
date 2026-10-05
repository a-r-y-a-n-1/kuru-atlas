export class SideRail {
  constructor(railElement, backdropElement, toggleBtn, places, onPlaceSelected) {
    this.rail = railElement;
    this.backdrop = backdropElement;
    this.toggleBtn = toggleBtn;
    this.places = places;
    this.onPlaceSelected = onPlaceSelected;
    this.listContainer = this.rail.querySelector('.rail-list');
    this.closeBtn = this.rail.querySelector('.rail-close-btn');

    this.render();
    this.setupListeners();
  }

  render() {
    this.listContainer.innerHTML = '';
    this.places.forEach((place, index) => {
      const li = document.createElement('li');
      li.className = 'rail-item';

      const seq = String(index + 1).padStart(2, '0');
      const isUncertain = place.identificationNote !== 'Archaeologically supported';

      const button = document.createElement('button');
      button.className = 'rail-link';
      button.dataset.id = place.id;
      button.setAttribute('aria-label', `${place.name}, ${place.parva}`);

      button.innerHTML = `
        <div class="rail-link-top">
          <span class="rail-link-seq">${seq}</span>
          <span class="rail-link-title">${place.name}</span>
        </div>
        <div class="rail-link-meta">
          <span class="rail-link-parva">${place.parva.split('&')[0].trim()}</span>
          <span class="rail-link-status ${isUncertain ? 'is-uncertain' : ''}">${isUncertain ? 'Uncertain' : 'Verified'}</span>
        </div>
      `;

      button.addEventListener('click', () => {
        this.close();
        this.onPlaceSelected(place.id);
      });

      li.appendChild(button);
      this.listContainer.appendChild(li);
    });
  }

  setupListeners() {
    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.closeBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());
  }

  open() {
    this.rail.classList.add('is-open');
    this.backdrop.classList.add('is-visible');
    // Focus first link for accessibility
    const firstLink = this.rail.querySelector('.rail-link');
    if (firstLink) firstLink.focus();
  }

  close() {
    this.rail.classList.remove('is-open');
    this.backdrop.classList.remove('is-visible');
  }

  toggle() {
    if (this.rail.classList.contains('is-open')) {
      this.close();
    } else {
      this.open();
    }
  }

  setActive(placeId) {
    const links = this.rail.querySelectorAll('.rail-link');
    links.forEach(link => {
      if (link.dataset.id === placeId) {
        link.classList.add('is-active');
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        link.classList.remove('is-active');
      }
    });
  }
}
