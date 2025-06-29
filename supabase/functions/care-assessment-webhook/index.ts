const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CareAssessmentData {
  serviceUserDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    gender: string;
    address: string;
    postcode: string;
    clientStartDate: string;
    allergies: string;
    serviceRequired: string;
  };
  nextOfKinDetails: {
    fullName: string;
    relationshipToClient: string;
    phoneNumber: string;
    email: string;
    address: string;
    postcode: string;
  };
  medicalBackgroundInformation: {
    medicalHistory: string;
    currentDiagnosis: string;
    hospitalAdmissionHistory: string;
    mobilitySupport: string;
    skinIntegrityNeeds: string;
    dnarInPlace: string;
    careVisitFrequency: string;
    careVisitDuration: string;
    requiresHelpWithAppointments: string;
    wantsCompanyToAppointments: string;
  };
  consent: boolean;
  submittedAt: string;
}

Deno.serve(async (req: Request) => {
  try {
    console.log("=== Care Assessment Webhook Function Started ===");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      console.log("Handling CORS preflight request");
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Only accept POST requests
    if (req.method !== "POST") {
      console.log("Invalid method:", req.method);
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get webhook URL from environment variable
    const webhookUrl = Deno.env.get("WEBHOOK_URL");
    
    if (!webhookUrl) {
      console.error("❌ Missing WEBHOOK_URL environment variable");
      return new Response(
        JSON.stringify({ 
          error: "Service configuration error",
          message: "Webhook URL is not configured",
          details: "The WEBHOOK_URL environment variable is not set. Please configure it in your Supabase project settings.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    console.log("=== Webhook Configuration ===");
    console.log("Using webhook URL:", webhookUrl);

    // Validate webhook URL format
    let validatedUrl: URL;
    try {
      validatedUrl = new URL(webhookUrl);
      console.log("✅ Webhook URL is valid:", validatedUrl.origin);
    } catch (urlError) {
      console.error("❌ Invalid webhook URL format:", webhookUrl);
      console.error("URL validation error:", urlError);
      return new Response(
        JSON.stringify({ 
          error: "Service configuration error",
          message: "Invalid webhook URL format",
          details: `The webhook URL is not valid: ${urlError instanceof Error ? urlError.message : 'Unknown error'}`,
          debugInfo: {
            providedUrl: webhookUrl,
            urlLength: webhookUrl.length
          }
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse the incoming request body
    let careAssessmentData: CareAssessmentData;
    try {
      const bodyText = await req.text();
      console.log("Request body length:", bodyText.length);
      careAssessmentData = JSON.parse(bodyText);
      console.log("✅ Successfully parsed request body");
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request body",
          message: "Failed to parse JSON data",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error"
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Validate required fields
    const hasFirstName = !!careAssessmentData.serviceUserDetails?.firstName;
    // Relaxed validation for testing - only firstName required
    
    console.log("=== Data Validation ===");
    console.log("Has first name:", hasFirstName);
    
    if (!hasFirstName) {
      console.error("❌ Missing required fields");
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields",
          message: "First name is required",
          details: {
            hasFirstName,
          }
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Prepare payload for webhook
    const payload = JSON.stringify(careAssessmentData);
    console.log("=== Webhook Request ===");
    console.log("Target URL:", validatedUrl.origin + validatedUrl.pathname);
    console.log("Payload size:", payload.length, "bytes");
    console.log("Client name:", `${careAssessmentData.serviceUserDetails.firstName} ${careAssessmentData.serviceUserDetails.lastName}`);

    // Forward the data to the external webhook
    let webhookResponse: Response;
    try {
      webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Supabase-Edge-Function/1.0",
        },
        body: payload,
      });
      
      console.log("✅ Webhook request sent successfully");
      console.log("Response status:", webhookResponse.status);
      console.log("Response headers:", Object.fromEntries(webhookResponse.headers.entries()));
      
    } catch (fetchError) {
      console.error("❌ Network error when calling webhook:", fetchError);
      console.error("Webhook URL was:", webhookUrl);
      
      return new Response(
        JSON.stringify({ 
          error: "Network error",
          message: "Failed to connect to the webhook endpoint",
          details: fetchError instanceof Error ? fetchError.message : "Unknown network error",
          debugInfo: {
            webhookUrl: validatedUrl.origin + validatedUrl.pathname,
            errorType: fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError
          }
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if the webhook call was successful
    if (!webhookResponse.ok) {
      let errorText: string;
      try {
        errorText = await webhookResponse.text();
        console.error("❌ Webhook error response:", errorText);
      } catch (textError) {
        errorText = "Could not read error response";
        console.error("❌ Failed to read webhook error response:", textError);
      }
      
      console.error(`❌ Webhook call failed with status: ${webhookResponse.status}`);
      
      return new Response(
        JSON.stringify({ 
          error: "Webhook call failed",
          message: `The webhook endpoint returned an error (status ${webhookResponse.status})`,
          details: {
            status: webhookResponse.status,
            statusText: webhookResponse.statusText,
            errorResponse: errorText,
            webhookUrl: validatedUrl.origin + validatedUrl.pathname
          }
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get the response from the webhook
    let webhookData: string;
    try {
      webhookData = await webhookResponse.text();
      console.log("✅ Webhook success response:", webhookData);
    } catch (textError) {
      console.error("⚠️ Failed to read webhook success response:", textError);
      webhookData = "Success (could not read response body)";
    }
    
    console.log("=== Function Completed Successfully ===");
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Care assessment submitted successfully",
        debugInfo: {
          webhookUrl: validatedUrl.origin + validatedUrl.pathname,
          responseStatus: webhookResponse.status,
          clientName: careAssessmentData.serviceUserDetails.firstName
        }
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("💥 Unhandled error in care assessment function:", error);
    console.error("Error type:", typeof error);
    console.error("Error constructor:", error?.constructor?.name);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    // Provide detailed error information
    let errorMessage = "Unknown error occurred";
    let errorDetails = "No additional details available";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.toString();
    } else if (typeof error === 'string') {
      errorMessage = error;
      errorDetails = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
      errorDetails = JSON.stringify(error);
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: "An unexpected error occurred while processing the care assessment submission",
        details: {
          errorMessage,
          errorDetails,
          timestamp: new Date().toISOString()
        }
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});