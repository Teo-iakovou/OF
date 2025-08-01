const User = require("../models/user");
const OpenAI = require("openai");
const Conversation = require("../models/conversation");

// Helper: simple keyword check for premium features
const premiumKeywords = [
  "content calendar",
  "pricing",
  "script",
  "sales funnel",
  "menu",
  "DM blast",
  "VIP",
  "bulk message",
];

// Check if the question is premium-only
function isPremiumRequest(question) {
  return premiumKeywords.some((kw) => question.toLowerCase().includes(kw));
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const coachChatHandler = async (req, res) => {
  try {
    const { email, question, latestContentInfo, conversationId, title } =
      req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ error: "User not found." });

    const plan = user.purchasedPackage || "lite";
    let chatLimit = 3;
    if (plan === "pro") chatLimit = 20;
    if (plan === "ultimate") chatLimit = 1000;

    // Track usage
    user.chatsUsed = user.chatsUsed || 0;

    // Privilege gating
    if (user.chatsUsed >= chatLimit) {
      return res.json({
        ai: "You’ve reached your chat limit for this plan. Upgrade to ask more questions!",
      });
    }
    if (plan === "lite" && isPremiumRequest(question)) {
      return res.json({
        ai: "This feature is available only on Pro/Ultimate plans. Upgrade to unlock advanced strategies, scripts, and more!",
      });
    }

    // Build system prompt
    const systemPrompt = `
You are Sage, an OnlyFans strategist AI. The user’s current plan: ${plan}.
If plan is ‘Lite’, answer only basic questions, give quick tips or 1-sentence advice.
If the user asks for advanced features (scripts, content calendars, sales plans, DM strategies), politely say: “This feature is available with the Pro/Ultimate plan. Upgrade to unlock advanced strategies and scripts.”
If plan is ‘Pro’, answer with detailed step-by-step advice, write sample scripts, content calendars, pricing tips, etc.
If plan is ‘Ultimate’, go above and beyond—provide custom, premium-level advice with multiple examples.
If the user uploaded content, here is the context: ${
      latestContentInfo || "No recent content provided."
    }
Always be clear and direct about what features are available for each plan.
`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 350,
      temperature: 0.8,
    });
    const aiMessage = response.choices[0].message.content.trim();

    // Track and save chat usage
    user.chatsUsed += 1;
    await user.save();

    // Conversation logic
    let conversation;
    if (conversationId) {
      // Add to existing conversation
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      conversation.messages.push(
        { role: "user", content: question },
        { role: "assistant", content: aiMessage }
      );
      conversation.updatedAt = Date.now();
      await conversation.save();
    } else {
      // Start a new conversation
      conversation = await Conversation.create({
        user: user._id,
        title: title || "Untitled conversation",
        messages: [
          { role: "user", content: question },
          { role: "assistant", content: aiMessage },
        ],
      });
    }

    // Return the answer AND the conversation object
    res.json({
      ai: aiMessage,
      conversation,
    });
  } catch (err) {
    console.error("AI Coach Error:", err);
    res.status(500).json({ error: "AI coach failed to respond." });
  }
};

module.exports = { coachChatHandler };
