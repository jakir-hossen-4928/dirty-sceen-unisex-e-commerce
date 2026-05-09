class StoreLocator extends HTMLElement {
  constructor() {
    super();
    this.item = this.querySelectorAll('.item');
    this.map = this.querySelector('#map');

    if (this.item) this.item.forEach(item => {item.addEventListener('click', this.onButtonClick.bind(this))});
  }

  onButtonClick(event) {
    const target = event.currentTarget;
    const map = target.dataset.map;
    this.map.classList.add('map-loading');
    this.querySelector('.active').classList.remove('active');
    target.classList.add('active');
    setTimeout(() => {this.map.innerHTML = map}, 300);
    setTimeout(() => {this.map.classList.remove('map-loading')}, 1200);
  }
}
customElements.define('store-locator', StoreLocator)