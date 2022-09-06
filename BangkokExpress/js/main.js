import Carousel from '../components/carousel/carousel.js';
import slides from '../components/carousel/slides.js';
import RibbonMenu from '../components/ribbonMenu/ribbonMenu.js';
import categories from '../components/ribbonMenu/categories.js';
import StepSlider from '../components/stepSlider/stepSlider.js';
import ProductsGrid from '../components/productGrid/productGrid.js';
import CartIcon from '../components/cartIcon/cartIcon.js';
import Cart from '../components/cart/cart.js';

export default class Main {
  productsGrid = '';
  products = [];

  constructor() {
  }

  async render() {
    const carousel = new Carousel(slides);
    const carouselContainer = document.body.querySelector('[data-carousel-holder]');
    carouselContainer.append(carousel.elem);

    const ribbonMenu = new RibbonMenu(categories);
    const ribbonContainer = document.body.querySelector('[data-ribbon-holder]');
    ribbonContainer.append(ribbonMenu.elem);

    const stepSlider = new StepSlider({
      steps: 5,
      value: 3,
    });

    const sliderContainer = document.body.querySelector('[data-slider-holder]');
    sliderContainer.append(stepSlider.elem);

    const cartIcon = new CartIcon();
    const cartIconContainer = document.body.querySelector('[data-cart-icon-holder]');
    cartIconContainer.append(cartIcon.elem);
    const cart = new Cart(cartIcon);

    let response = await fetch("/json/products.json");
    this.products = response.ok ? await response.json() : [];
  
    this.productsGrid = new ProductsGrid(this.products);
    const productsGridContainer = document.body.querySelector('[data-products-grid-holder]');
    productsGridContainer.removeChild(productsGridContainer.children[0]);
    productsGridContainer.append(this.productsGrid.elem);

    document.body.addEventListener('product-add', (event)=> {
      
      this.products.map((product)=> {
        if (product.id === event.detail) {
          cart.addProduct(product);
        }
      });
    });

    document.body.querySelector('.slider').addEventListener('slider-change', (event)=>{
      this.productsGrid.updateFilter({
        maxSpiciness: event.detail
      });
    });

    document.body.querySelector('.ribbon').addEventListener('ribbon-select', (event)=>{
      this.productsGrid.updateFilter({
        category: event.detail
      });
    });

    document.querySelector('#nuts-checkbox').addEventListener('change', ()=> {
      this.productsGrid.updateFilter({
        noNuts: document.querySelector('#nuts-checkbox').checked
      }); 
    });

    document.querySelector('#vegeterian-checkbox').addEventListener('change', ()=> {
      this.productsGrid.updateFilter({
        vegeterianOnly: document.querySelector('#vegeterian-checkbox').checked
      }); 
    });
  }
}