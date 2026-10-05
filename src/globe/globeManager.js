import Globe from 'globe.gl';

export class GlobeManager {
  constructor(container, places, onPlaceSelected) {
    this.container = container;
    this.places = places;
    this.onPlaceSelected = onPlaceSelected;
    this.activePlaceId = null;
    this.globe = null;
    this.pinElements = new Map();
    this.isPanelOpen = false;

    this.defaultView = {
      lat: 25.0,
      lng: 78.5,
      altitude: 2.2
    };

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initGlobe();
    this.setupListeners();
  }

  initGlobe() {
    this.globe = Globe()(this.container)
      .globeImageUrl('/textures/earth-dark.jpg')
      .bumpImageUrl('/textures/earth-topology.png')
      .backgroundColor('#0b0a08')
      .showAtmosphere(true)
      .atmosphereColor('#8a6843')
      .atmosphereAltitude(0.14)
      .showGraticules(false)
      .htmlElementsData(this.places)
      .htmlLat(d => d.lat)
      .htmlLng(d => d.lng)
      .htmlAltitude(0.012)
      .htmlElement(d => this.createPinElement(d));

    // Cap pixel ratio to 2 for performance and battery
    const renderer = this.globe.renderer();
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    // Configure OrbitControls for calm auto-rotation
    const controls = this.globe.controls();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.7;
      controls.zoomSpeed = 0.9;
      controls.minDistance = 120;
      controls.maxDistance = 500;

      if (!this.prefersReducedMotion) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.22;
      } else {
        controls.autoRotate = false;
      }

      // Stop idle auto-rotate immediately on user manual interaction
      controls.addEventListener('start', () => {
        controls.autoRotate = false;
      });
    }

    // Initial camera position (overview of Aryavarta)
    this.globe.pointOfView(this.defaultView, 0);
  }

  createPinElement(d) {
    const el = document.createElement('div');
    el.className = 'kuru-pin';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${d.name} (${d.parva})`);
    el.dataset.id = d.id;

    el.innerHTML = `
      <div class="kuru-pin-stem"></div>
      <div class="kuru-pin-head"></div>
      <div class="kuru-pin-ring"></div>
      <div class="kuru-pin-label">${d.name}</div>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onPlaceSelected(d.id);
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        this.onPlaceSelected(d.id);
      }
    });

    this.pinElements.set(d.id, el);
    return el;
  }

  flyToPlace(place, isPanelOpen = true) {
    if (!place || !this.globe) return;
    this.isPanelOpen = isPanelOpen;
    this.activePlaceId = place.id;
    this.updateActivePin(place.id);

    // Stop auto-rotation during focused inspection
    const controls = this.globe.controls();
    if (controls) {
      controls.autoRotate = false;
    }

    const isMobile = window.innerWidth <= 768;
    const duration = this.prefersReducedMotion ? 0 : 1500;

    let targetLat = place.lat;
    let targetLng = place.lng;
    let altitude = 0.44;

    if (isPanelOpen) {
      if (isMobile) {
        // Shift latitude southwards so the pin remains centered in the visible upper half above the bottom sheet
        targetLat = place.lat - 6.0;
        altitude = 0.65;
      } else {
        // Shift longitude eastwards so the pin sits in the left ~60% of the screen
        targetLng = place.lng + 11.2;
        altitude = 0.42;
      }
    }

    this.globe.pointOfView({
      lat: targetLat,
      lng: targetLng,
      altitude: altitude
    }, duration);
  }

  flyHome() {
    this.activePlaceId = null;
    this.isPanelOpen = false;
    this.updateActivePin(null);

    const duration = this.prefersReducedMotion ? 0 : 1500;
    this.globe.pointOfView(this.defaultView, duration);
  }

  updateActivePin(activeId) {
    this.pinElements.forEach((el, id) => {
      if (id === activeId) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });
  }

  setupListeners() {
    // Pause auto-rotation when the tab is hidden
    document.addEventListener('visibilitychange', () => {
      const controls = this.globe?.controls();
      if (!controls) return;
      if (document.hidden) {
        controls.autoRotate = false;
      } else if (!this.activePlaceId && !this.prefersReducedMotion) {
        // Can optionally resume auto-rotate if in overview state
      }
    });

    // Handle responsive window resize
    window.addEventListener('resize', () => {
      if (this.globe) {
        this.globe.width(window.innerWidth);
        this.globe.height(window.innerHeight);
      }
    });
  }
}
