const Stripe = require("stripe");
const User = require("../models/user");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a checkout session
const createCheckoutSession = async (req, res) => {
  const { email, packageId } = req.body;

  const packages = {
    lite: 500, // amount in cents (€5.00)
    pro: 1500,
    ultimate: 3000,
  };

  if (!packages[packageId]) {
    return res.status(400).json({ error: "Invalid package" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `${packageId.toUpperCase()} Package` },
            unit_amount: packages[packageId],
          },
          quantity: 1,
        },
      ],
      metadata: { email, packageId },
      success_url: `${process.env.CLIENT_URL}/dashboard/upload?status=success`,
      cancel_url: `${process.env.CLIENT_URL}/?status=cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// Stripe webhook to update user package
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.metadata.email;
    const packageId = session.metadata.packageId;

    try {
      let user = await User.findOne({ email });
      if (!user) user = new User({ email, purchasedPackage: packageId });
      else user.purchasedPackage = packageId;

      await user.save();
      console.log("✅ Package updated for:", email);
    } catch (err) {
      console.error("❌ Failed to update user after checkout:", err);
    }
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleStripeWebhook };
