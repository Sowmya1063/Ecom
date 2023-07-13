import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { LilyFormService } from 'src/app/services/lily-form.service';
import { FormValidator } from 'src/app/validators/form-validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkOutFormGroup: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  billingAddressStates: State[] = [];
  shippingAddressStates: State[] = [];
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];

  storage: Storage = sessionStorage;
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  isDisabled:boolean=false;
  constructor(private formBuilder: FormBuilder, private lilyFormService: LilyFormService
    , private cartService: CartService, private checkoutService: CheckoutService,
    private router: Router) { }
  ngOnInit(): void {
    this.setupStripePaymentForm();
    this.reviewCartDetails();
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required,Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required,Validators.pattern('^[0-9]{3}$')]),
        expirationMonth:[''],
        expirationYear:['']*/
      })

    });
    /*
       const startMonth: number = new Date().getMonth() + 1;
       console.log(`start month:${startMonth}`);
       this.lilyFormService.getCreditCardMonths(startMonth).subscribe(
         data => {
           console.log("Retrieved months:" + JSON.stringify(data));
           this.creditCardMonths = data;
         });
   
       this.lilyFormService.getCreditCardYears().subscribe(
         data => {
           console.log("Retrieved years:" + JSON.stringify(data));
           this.creditCardYears = data;
         });
           */
    this.lilyFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved Countries:" + JSON.stringify(data));
        this.countries = data;
      });
  }
  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      }
      else if (event.error) {
        this.displayError.textContent = event.error.message;
      }

    });
  }

  reviewCartDetails() {

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() {
    return this.checkOutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkOutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkOutFormGroup.get('customer.email');
  }

  get ShippingAddressStreet() {
    return this.checkOutFormGroup.get('shippingAddress.street');
  }

  get ShippingAddressCity() {
    return this.checkOutFormGroup.get('shippingAddress.city');
  }

  get ShippingAddressState() {
    return this.checkOutFormGroup.get('shippingAddress.state');
  }

  get ShippingAddressCountry() {
    return this.checkOutFormGroup.get('shippingAddress.country');
  }

  get ShippingAddressZipCode() {
    return this.checkOutFormGroup.get('shippingAddress.zipCode');
  }

  get BillingAddressStreet() {
    return this.checkOutFormGroup.get('billingAddress.street');
  }

  get BillingAddressCity() {
    return this.checkOutFormGroup.get('billingAddress.city');
  }

  get BillingAddressState() {
    return this.checkOutFormGroup.get('billingAddress.state');
  }

  get BillingAddressCountry() {
    return this.checkOutFormGroup.get('billingAddress.country');
  }

  get BillingAddressZipCode() {
    return this.checkOutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType() {
    return this.checkOutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkOutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkOutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkOutFormGroup.get('creditCard.securityCode');
  }



  onSubmit() {
    console.log(`handling submit button`);
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = [];
    for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    let purchase = new Purchase();

    purchase.customer = this.checkOutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.email=purchase.customer.email;
    console.log(`on front end:${this.paymentInfo.amount}`);

    if (!this.checkOutFormGroup.invalid && this.displayError.textContent === "") {
      this.isDisabled=true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            payment_method: {
              card: this.cardElement,
              billing_details:{
                email:purchase.customer.email,
                name:`${purchase.customer.firstName}+${purchase.customer.firstName} `,
                address:{
                  line1:purchase.billingAddress.street,
                  city:purchase.billingAddress.city,
                  state:purchase.billingAddress.state,
                  postal_code:purchase.billingAddress.zipCode,
                  country:this.BillingAddressCountry.value.code
                }
              }
            }
          }, { handleActions: false })
            .then((result: any) => {
              
              if (result.error) {
                alert(`There was an error:${result.error.message}`);
                this.isDisabled=false;
              }
              else {
                
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been recieved.\nOrder Tracking Number:${response.orderTrackingNumber}`);
                    this.resetCart();
                    this.isDisabled=false;
                  },
                   error:(err:any) => {
                    alert(`there was an error: ${err.message}`);
                    this.isDisabled=false;
                   }
                })
                
              }
            })
        }
      );
    } else{
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkOutFormGroup.reset();
    this.cartService.persistCartItems();

    this.router.navigateByUrl("/products");

  }
  copyShippingToBillingAddress(event) {
    if (event.target.checked) {
      this.checkOutFormGroup.controls['billingAddress']
        .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkOutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];

    }

  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;
    if (currentYear == selectedYear)
      startMonth = new Date().getMonth() + 1;
    else
      startMonth = 1;
    this.lilyFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName);
    const countrycode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} code:${countrycode}`);
    console.log(`${formGroupName} name:${countryName}`);
    this.lilyFormService.getStates(countrycode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;

        }
        else {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}












