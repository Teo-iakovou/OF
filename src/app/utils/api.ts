// utils/api.ts
export const analyzeImage = async (file: File, email: string) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", email); // ✅ include email in the request

  try {
    const response = await fetch("http://localhost:5000/api/analyze", {
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
      `http://localhost:5000/api/analyze?page=${currentPage}&search=${searchTerm}&platform=${filterPlatform}`
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

    const response = await fetch(`http://localhost:5000/api/analyze/${id}`, {
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

// User Package APIs (Ensure Express backend has these routes)
export interface UserPackageResponse {
  hasAccess: boolean;
  package?: string;
  uploadsRemaining?: number;
}

export const purchasePackage = async (
  email: string,
  packageId: string
): Promise<{ message: string }> => {
  const response = await fetch("http://localhost:5000/api/user/purchase", {
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
    `http://localhost:5000/api/user/check-package?email=${email}`
  );

  if (!response.ok) {
    throw new Error("Failed to check user package");
  }

  return response.json();
};
export const startCheckout = async (email: string, packageId: string) => {
  const response = await fetch(
    "http://localhost:5000/api/checkout/create-checkout-session",
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
  window.location.href = data.url; // redirect to Stripe Checkout
};
