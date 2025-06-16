const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const analyzeImage = async (file: File, email: string) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", email);

  try {
    const response = await fetch(`${BASE_URL}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();
    console.log("Analyze Image API Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to analyze image: ${response.status} - ${responseText}`
      );
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error in analyzeImage:", error);
    throw error;
  }
};

export const fetchAnalysisHistory = async (
  currentPage: number,
  searchTerm: string = "",
  filterPlatform: string = ""
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/analyze?page=${currentPage}&search=${searchTerm}&platform=${filterPlatform}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    throw error;
  }
};

export const deleteAnalysisResult = async (id: string) => {
  try {
    console.log("Attempting to delete result with ID:", id);

    const response = await fetch(`${BASE_URL}/api/analyze/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseText = await response.text();
    console.log("Delete API Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to delete analysis result: ${response.status} - ${responseText}`
      );
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error in deleteAnalysisResult:", error);
    throw error;
  }
};

export interface UserPackageResponse {
  hasAccess: boolean;
  package?: string;
  uploadsRemaining?: number;
  expiresAt?: string;
}

export const purchasePackage = async (
  email: string,
  packageId: string
): Promise<{ message: string }> => {
  const response = await fetch(`${BASE_URL}/api/user/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, packageId }),
  });

  if (!response.ok) {
    throw new Error("Failed to purchase package");
  }

  return response.json();
};

export const checkUserPackage = async (
  email: string
): Promise<UserPackageResponse> => {
  const response = await fetch(
    `${BASE_URL}/api/user/check-package?email=${email}`
  );

  if (!response.ok) {
    throw new Error("Failed to check user package");
  }

  return response.json();
};

export const startCheckout = async (email: string, packageId: string) => {
  const response = await fetch(
    `${BASE_URL}/api/checkout/create-checkout-session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, packageId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to start checkout session");
  }

  const data = await response.json();
  window.location.href = data.url;
};

export const sendFeedback = async (message: string, email?: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to send feedback");
    }

    return await res.json();
  } catch (err) {
    console.error("❌ sendFeedback error:", err);
    throw err;
  }
};

export async function coachChat({
  email,
  question,
  latestContentInfo,
  conversationId,
  title,
}: {
  email: string;
  question: string;
  latestContentInfo?: string;
  conversationId?: string;
  title?: string;
}) {
  const res = await fetch(`${BASE_URL}/api/coach-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      question,
      latestContentInfo,
      conversationId,
      title,
    }),
  });
  if (!res.ok) throw new Error("AI chat failed");
  return res.json();
}

// Get all conversations for a user (for sidebar/history)
export async function fetchConversations(userId: string) {
  const res = await fetch(`${BASE_URL}/api/conversations?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

// Get a single conversation (full messages)
export async function fetchConversation(conversationId: string) {
  const res = await fetch(`${BASE_URL}/api/conversations/${conversationId}`);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  return res.json();
}

// Delete a conversation
export async function deleteConversation(conversationId: string) {
  const res = await fetch(`${BASE_URL}/api/conversations/${conversationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete conversation");
  return res.json();
}
