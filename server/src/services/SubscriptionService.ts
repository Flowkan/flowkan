import SubscriptionModel from "../models/SubscriptionModel";

class SubscriptionService {
  private readonly subscriptionModel: SubscriptionModel;
  constructor(subscriptionModel: SubscriptionModel) {
    this.subscriptionModel = subscriptionModel;
  }

  getSubscription(userId: number) {
    return this.subscriptionModel.findByUserId(userId);
  }

  create(userId: number, planId: number, endDate?: Date, autoRenew = false) {
    return this.subscriptionModel.createSubscription({
      userId,
      planId,
      endDate,
      autoRenew,
    });
  }

  cancel(userId: number) {
    return this.subscriptionModel.cancelSubscription(userId);
  }

  renew(userId: number, months: number = 1) {
    return this.subscriptionModel.renewSubscription(userId, months);
  }
}

export default SubscriptionService;
