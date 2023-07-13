import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems:CartItem[]=[];
  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0.00);
    // storage:Storage=sessionStorage;
    storage:Storage=localStorage;
    constructor() {
      let data=JSON.parse(this.storage.getItem('cartItems')!);
      if(data!=null){
        this.cartItems=data;
        this.computeCartTotals();
      }
     }

    addToCart(theCartItem:CartItem){
      let alreadyExistsInCart:boolean=false;
      let existingCartItem :CartItem=undefined;
      if(this.cartItems.length>0){
          existingCartItem=this.cartItems.find(temp=>temp.id==theCartItem.id);
          alreadyExistsInCart=(existingCartItem!=undefined)
      }
      if(alreadyExistsInCart){
        existingCartItem.quantity+=1;

      }
      else{
        this.cartItems.push(theCartItem);
      }
      this.computeCartTotals();
    }
  computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;
    for(let temp of this.cartItems){
      totalPriceValue+=temp.quantity*temp.unitPrice;
      totalQuantityValue+=temp.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue,totalQuantityValue);
    this.persistCartItems();
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contents of cart');
    for(let temp of this.cartItems){
      const subTotal=temp.unitPrice*temp.quantity;
      console.log(`product:${temp.name},quantitity:${temp.quantity},price:${temp.unitPrice},sub total:${subTotal}`);

    }

    console.log(`total price:${totalPriceValue.toFixed(2)},total quantity:${totalQuantityValue}`);
  }
  decrementQuantity(cartItem:CartItem){
    cartItem.quantity--;
    if(cartItem.quantity==0){
      this.remove(cartItem);
    }
    else
    {
      this.computeCartTotals();
    }
  }
  remove(cartItem: CartItem) {
    const itemidx=this.cartItems.findIndex(temp=>cartItem.id==temp.id);
    if(itemidx > -1){
       this.cartItems.splice(itemidx,1);
       this.computeCartTotals();
    }
  }

  persistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }
}
