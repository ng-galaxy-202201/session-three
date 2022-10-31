import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductsService } from 'src/app/servicios/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  productSelected?: Product;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getAll()
      .subscribe((products) => {
        this.products = products;
      })
  }

  addProduct() {
    this.productsService.create(this.productSelected!)
      .subscribe((product) => {
        this.products.push(product)
        this.productSelected = undefined;
      })
  }

  newProduct() {
    this.productSelected = {
      id: 0,
      title: '',
      price: 0,
      description: '',
      category: '',
      image: '',
      rating: { rate: 0, count: 0 }
    };
  }

  editProduct(product: Product) {
    this.productSelected = product;
  }

  updateProduct() {
    this.productsService.update(this.productSelected!.id, this.productSelected!)
    .subscribe((product) => {
      const index = this.products.findIndex(product => product.id === this.productSelected!.id)
      this.products[index] = product;
      this.productSelected = undefined;
    })
  }

  deleteProduct(id: number) {
    this.productsService.delete(id)
    .subscribe(() => {
      const index = this.products.findIndex(product => product.id === id)
      this.products.splice(index, 1)
    })
  }

  save() {
    (this.productSelected?.id) ? this.updateProduct() : this.addProduct()
  }

}
