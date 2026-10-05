import placesData from './data/places.json';
import { GlobeManager } from './globe/globeManager.js';
import { DetailPanel } from './ui/panel.js';
import { SideRail } from './ui/rail.js';

class KuruAtlasApp {
  constructor() {
    this.places = placesData;
    this.currentPlaceIndex = -1;

    this.init();
  }

  init() {
    const globeContainer = document.getElementById('globe-container');
    const panelElement = document.getElementById('detail-panel');
    const railElement = document.getElementById('side-rail');
    const backdropElement = document.getElementById('rail-backdrop');
    const railToggleBtn = document.getElementById('rail-toggle-btn');

    // Initialize UI Detail Panel
    this.panel = new DetailPanel(panelElement, {
      onClose: () => this.handlePanelClosed(),
      onNavigate: (direction) => this.navigateStoryOrder(direction)
    });

    // Initialize 3D Globe with places
    this.globeManager = new GlobeManager(
      globeContainer,
      this.places,
      (placeId) => this.selectPlace(placeId)
    );

    // Initialize Collapsible Side Rail
    this.sideRail = new SideRail(
      railElement,
      backdropElement,
      railToggleBtn,
      this.places,
      (placeId) => this.selectPlace(placeId)
    );

    this.setupGlobalShortcuts();
  }

  selectPlace(placeId) {
    const index = this.places.findIndex(p => p.id === placeId);
    if (index === -1) return;

    this.currentPlaceIndex = index;
    const place = this.places[index];
    const prevPlace = index > 0 ? this.places[index - 1] : null;
    const nextPlace = index < this.places.length - 1 ? this.places[index + 1] : null;

    // Fly camera smoothly to place with left 60% offset
    this.globeManager.flyToPlace(place, true);

    // Open detail panel and update contents
    this.panel.open(place, index, this.places.length, prevPlace, nextPlace);

    // Highlight item in side rail
    this.sideRail.setActive(placeId);
  }

  handlePanelClosed() {
    this.currentPlaceIndex = -1;
    this.globeManager.flyHome();
    this.sideRail.setActive(null);
  }

  navigateStoryOrder(direction) {
    if (this.currentPlaceIndex === -1) return;

    if (direction === 'prev' && this.currentPlaceIndex > 0) {
      const prevPlace = this.places[this.currentPlaceIndex - 1];
      this.selectPlace(prevPlace.id);
    } else if (direction === 'next' && this.currentPlaceIndex < this.places.length - 1) {
      const nextPlace = this.places[this.currentPlaceIndex + 1];
      this.selectPlace(nextPlace.id);
    }
  }

  setupGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is inside an input or form element (not that there are any, but good hygiene)
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'Escape') {
        if (this.sideRail.rail.classList.contains('is-open')) {
          this.sideRail.close();
          return;
        }

        if (this.panel.isOpen()) {
          this.panel.close();
          this.handlePanelClosed();
        }
      } else if (e.key === 'ArrowLeft') {
        if (this.panel.isOpen()) {
          e.preventDefault();
          this.navigateStoryOrder('prev');
        }
      } else if (e.key === 'ArrowRight') {
        if (this.panel.isOpen()) {
          e.preventDefault();
          this.navigateStoryOrder('next');
        }
      }
    });
  }
}

// Instantiate application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new KuruAtlasApp();
});
