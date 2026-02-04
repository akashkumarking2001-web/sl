
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalCashback } = useCart();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <Button variant="ghost" className="mb-8" onClick={() => navigate("/shopping")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
                </Button>

                <h1 className="text-3xl font-black text-slate-900 mb-8">My Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
                        <Button onClick={() => navigate("/shopping")} className="h-12 px-8 rounded-xl font-bold">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center shadow-sm">
                                    <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">{item.name}</h3>
                                        <div className="text-sm font-medium text-slate-500 mt-1">
                                            ₹{item.price.toLocaleString()}
                                        </div>
                                        {item.cashback > 0 && (
                                            <div className="text-xs font-bold text-emerald-600 mt-1">
                                                +{item.cashback} Cashback
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-red-500" onClick={() => removeFromCart(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
                                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-6 text-sm">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Estimated Tax</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <div className="flex justify-between text-lg font-black text-slate-900">
                                        <span>Total</span>
                                        <span>₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    {totalCashback > 0 && (
                                        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold text-center">
                                            You will earn ₹{totalCashback.toLocaleString()} Cashback!
                                        </div>
                                    )}
                                </div>
                                <Button
                                    className="w-full h-14 rounded-xl text-lg font-black"
                                    onClick={() => navigate(`/payment?source=cart&amount=${totalPrice}`)}
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
