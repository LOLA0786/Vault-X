import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { PaymentService } from '@/lib/payment-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface PaymentButtonProps {
  amount?: number;
  currency?: string;
  description?: string;
}

export function PaymentButton({ 
  amount = 499, 
  currency = 'INR', 
  description = 'Premium Access' 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a payment.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create order
      const orderData = await PaymentService.createOrder({
        amount,
        currency,
        description
      }, user.id); // Pass the user ID

      if (!orderData.success || !orderData.order || !orderData.key) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Open Razorpay checkout
      const response = await PaymentService.openRazorpayCheckout(orderData);
      
      // Verify payment
      const verification = await PaymentService.verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      });

      if (verification.success) {
        toast({
          title: "Payment Successful!",
          description: "Thank you for your payment.",
          variant: "default"
        });
      } else {
        throw new Error(verification.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong with your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      variant="premium"
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium"
      size="lg"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4 mr-2" />
      )}
      {loading ? "Processing..." : "Pay Now"}
    </Button>
  );
}