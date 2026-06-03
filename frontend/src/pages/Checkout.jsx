import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  ShieldCheck,
  Truck,
  CreditCard as CardIcon,
  Smartphone,
  Wallet
} from 'lucide-react';
import { cn } from '../utils/cn';

const Checkout = () => {
  const { cart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Card'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateShipping()) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/cart');
  };

  const placeOrder = async () => {
    setLoading(true);
    const orderData = {
      user: user._id,
      orderItems: cart.map(item => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity
      })),
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      totalPrice: totalPrice,
    };

    try {
      await axios.post('http://localhost:5000/api/orders', orderData);
      clearCart();
      setStep(4); // Success step
      setTimeout(() => navigate('/my-orders'), 3000);
    } catch (error) {
      console.error(error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: CheckCircle2 }
  ];

  const floatingInputClass = (name) => cn(
    "w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all peer placeholder-transparent",
    errors[name] ? "border-red-500 focus:ring-red-50" : "border-muted focus:border-primary focus:ring-4 focus:ring-primary/5"
  );

  const labelClass = "absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-primary peer-focus:bg-white pointer-events-none";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        
        {/* Header & Stepper */}
        <div className="mb-12">
           <button type="button" onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors cursor-pointer">
             <ArrowLeft size={18} />
             <span>Back to {step === 1 ? 'Cart' : 'Previous Step'}</span>
           </button>
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <h1 className="text-4xl font-extrabold text-primary">Checkout</h1>
             
             {/* Stepper UI */}
             <div className="flex items-center gap-4">
               {steps.map((s, idx) => (
                 <React.Fragment key={s.id}>
                   <div className="flex items-center gap-2">
                     <div className={cn(
                       "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                       step >= s.id ? "bg-primary text-white" : "bg-white border border-muted text-muted-foreground"
                     )}>
                       {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                     </div>
                     <span className={cn("font-bold text-sm", step >= s.id ? "text-primary" : "text-muted-foreground")}>
                       {s.name}
                     </span>
                   </div>
                   {idx < steps.length - 1 && <div className="h-[2px] w-8 md:w-12 bg-muted overflow-hidden">
                      <div className={cn("h-full bg-primary transition-all duration-500", step > s.id ? "w-full" : "w-0")} />
                   </div>}
                 </React.Fragment>
               ))}
             </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-3xl p-8 border border-muted shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                      <MapPin className="text-accent" />
                      Shipping Details
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative md:col-span-2">
                        <input 
                          type="text" 
                          name="address"
                          id="address"
                          placeholder="Street Address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={floatingInputClass('address')}
                        />
                        <label htmlFor="address" className={labelClass}>Street Address</label>
                        {errors.address && <p className="text-red-500 text-xs mt-1 absolute">{errors.address}</p>}
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="text" 
                          name="city"
                          id="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={floatingInputClass('city')}
                        />
                        <label htmlFor="city" className={labelClass}>City</label>
                        {errors.city && <p className="text-red-500 text-xs mt-1 absolute">{errors.city}</p>}
                      </div>

                      <div className="relative">
                        <input 
                          type="text" 
                          name="postalCode"
                          id="postalCode"
                          placeholder="Postal Code"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={floatingInputClass('postalCode')}
                        />
                        <label htmlFor="postalCode" className={labelClass}>Postal Code</label>
                        {errors.postalCode && <p className="text-red-500 text-xs mt-1 absolute">{errors.postalCode}</p>}
                      </div>

                      <div className="relative md:col-span-2">
                        <input 
                          type="text" 
                          name="country"
                          id="country"
                          placeholder="Country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={floatingInputClass('country')}
                        />
                        <label htmlFor="country" className={labelClass}>Country</label>
                        {errors.country && <p className="text-red-500 text-xs mt-1 absolute">{errors.country}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={handleNext}
                    className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-3xl p-8 border border-muted shadow-sm">
                    <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                      <CreditCard className="text-accent" />
                      Payment Method
                    </h2>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'Card', name: 'Credit / Debit Card', icon: CardIcon, desc: 'Visa, Mastercard, Amex' },
                        { id: 'UPI', name: 'UPI Payment', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                        { id: 'Wallet', name: 'Digital Wallets', icon: Wallet, desc: 'Apple Pay, PayPal' }
                      ].map((method) => (
                        <div 
                          key={method.id}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setFormData(prev => ({ ...prev, paymentMethod: method.id }));
                            }
                          }}
                          className={cn(
                            "group relative p-6 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between select-none",
                            formData.paymentMethod === method.id 
                              ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                              : "border-muted hover:border-primary/20 bg-white hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                              formData.paymentMethod === method.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                            )}>
                              <method.icon size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-primary">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.desc}</p>
                            </div>
                          </div>
                          
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            formData.paymentMethod === method.id ? "border-primary bg-primary" : "border-muted"
                          )}>
                            {formData.paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="flex-grow md:flex-initial bg-primary text-white px-12 py-5 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                    >
                      Continue to Review
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-3xl p-8 border border-muted shadow-sm space-y-10">
                    <div>
                      <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <CheckCircle2 className="text-accent" />
                        Order Review
                      </h2>
                      
                      <div className="grid md:grid-cols-2 gap-8 bg-muted/30 p-6 rounded-2xl">
                         <div className="space-y-3 font-medium">
                            <div className="flex items-center gap-2 text-primary">
                               <Truck size={18} className="text-muted-foreground" />
                               <span className="text-sm uppercase tracking-wider font-bold">Shipping To</span>
                            </div>
                            <p className="text-primary text-lg">{user.name}</p>
                            <p className="text-muted-foreground">{formData.address}, {formData.city}</p>
                            <p className="text-muted-foreground">{formData.postalCode}, {formData.country}</p>
                         </div>
                         <div className="space-y-3 font-medium">
                            <div className="flex items-center gap-2 text-primary">
                               <CreditCard size={18} className="text-muted-foreground" />
                               <span className="text-sm uppercase tracking-wider font-bold">Payment Method</span>
                            </div>
                            <p className="text-primary text-lg">{formData.paymentMethod}</p>
                            <div className="flex items-center gap-2 text-green-600">
                               <ShieldCheck size={16} />
                               <span className="text-sm font-bold">Verified & Secure</span>
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">Order Items</h3>
                      {cart.map(item => (
                        <div key={item._id || item.id} className="flex items-center justify-between py-4 border-b border-muted last:border-0">
                           <div className="flex items-center gap-4">
                              <img src={item.image} className="w-16 h-16 object-cover rounded-xl border border-muted" alt={item.name} />
                              <div>
                                <p className="font-bold text-primary">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                           </div>
                           <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    disabled={loading}
                    onClick={placeOrder}
                    className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-50 shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    {loading ? "Processing..." : "Place Your Order"}
                    {!loading && <CheckCircle2 size={20} />}
                  </button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-16 border border-muted shadow-xl text-center"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-4xl font-extrabold text-primary mb-4">Order Placed!</h2>
                  <p className="text-lg text-muted-foreground mb-4">Thank you for your purchase. Your order number is #ORD-{Math.floor(Math.random() * 100000)}</p>
                  <p className="text-muted-foreground">Redirecting to your orders...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Summary Panel */}
          {step < 4 && (
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-8 border border-muted shadow-premium overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <h2 className="text-2xl font-bold text-primary mb-8">Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-primary font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span className="text-primary font-semibold">$0.00</span>
                  </div>
                  <div className="h-[1px] bg-muted w-full my-6" />
                  <div className="flex justify-between text-2xl font-black text-primary">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <Lock size={14} className="text-primary" />
                      Secure Checkout
                   </div>
                </div>

                <div className="mt-8 flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                   <ShieldCheck size={24} className="text-green-600" />
                   <div>
                     <p className="text-sm font-bold text-green-900 leading-tight">1-Year Warranty</p>
                     <p className="text-xs text-green-700">Included with your purchase</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
