import { useAuth } from '@/hooks/use-auth';

interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  notes: any;
}

export interface RazorpayResponse {
  success: boolean;
  order?: {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
  };
  payment?: any;
  key?: string;
  error?: string;
  details?: any;
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  description?: string;
  planId?: string;
  planName?: string;
  billingPeriod?: string;
}

export class PaymentService {
  static async createOrder(options: PaymentOptions): Promise<RazorpayResponse> {
    try {
      const userId = localStorage.getItem('user_email');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: Math.round(options.amount), // Ensure amount is an integer
          currency: options.currency || 'INR',
          planId: options.planId,
          planName: options.planName,
          billingPeriod: options.billingPeriod || 'month',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create payment order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async verifyPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    plan_id?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to verify payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async getUserPayments() {
    try {
      const userId = localStorage.getItem('user_email');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/payments/user/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user payments');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user payments:', error);
      return [];
    }
  }

  static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static async openRazorpayCheckout(orderData: RazorpayResponse): Promise<any> {
    if (!orderData.success || !orderData.order || !orderData.key) {
      throw new Error('Invalid order data');
    }

    const scriptLoaded = await this.loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    return new Promise((resolve, reject) => {
      // We've already checked that orderData.order exists above
      const order = orderData.order!;
      
      const options = {
        key: orderData.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Private Vault',
        description: 'Premium Access',
        order_id: order.id,
        handler: function (response: any) {
          resolve(response);
        },
        prefill: {
          email: localStorage.getItem('user_email') || '',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      try {
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } catch (error) {
        reject(error);
      }
    });
  }
}