export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  isDefault: boolean;
  priceWithoutDiscount: number;
  features: [
    {
      description: string;
    },
  ];
};
