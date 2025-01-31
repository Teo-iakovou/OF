export const analyzeImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text(); // Read raw response
    console.log("Analyze Image API Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to analyze image: ${response.status} - ${responseText}`
      );
    }

    return JSON.parse(responseText); // Parse JSON only if the request was successful
  } catch (error) {
    console.error("Error in analyzeImage:", error);
    throw error;
  }
};

export const fetchAnalysisHistory = async (page: number) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/analyze?page=${page}`,
      {
        method: "GET",
      }
    );

    const responseText = await response.text();
    console.log("Fetch History API Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch analysis history: ${response.status} - ${responseText}`
      );
    }

    const jsonResponse = JSON.parse(responseText);

    if (!jsonResponse.results || typeof jsonResponse.total !== "number") {
      throw new Error("Invalid API response format");
    }

    return jsonResponse;
  } catch (error) {
    console.error("Error in fetchAnalysisHistory:", error);
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
