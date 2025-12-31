
import { GoogleGenAI, Type } from "@google/genai";
import { Threat, UserLocation, RouteAnalysis } from '../types';

let genAI: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return genAI;
};

// Existing Summary Function
export const generateThreatSummary = async (
  location: UserLocation,
  nearbyThreats: Threat[]
): Promise<string> => {
  const ai = getAI();
  
  if (nearbyThreats.length === 0) {
    return "No active threats detected in this area at this time.";
  }

  const threatData = nearbyThreats.map(t => 
    `- [${t.type}] (${t.severity}) ${t.title}: ${t.description} (Source: ${t.source})`
  ).join('\n');

  const prompt = `
    You are a Global Threat Intelligence Analyst. 
    Analyze the following threat data for the location "${location.name}" (Lat: ${location.latitude}, Lon: ${location.longitude}).
    
    Threat Data:
    ${threatData}
    
    Instructions:
    1. Summarize the situation in under 150 words.
    2. Group threats by type.
    3. Highlight critical/high severity items first.
    4. Provide specific advice for the user based on the threat type.
    5. Be factual, clear, and non-alarmist.
    
    Output Format: Plain text, formatted with clear paragraphs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 300,
        temperature: 0.4,
      }
    });

    return response.text || "Unable to generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error contacting intelligence service.";
  }
};

// Page 1: Resolve Location (Translate + Geocode)
export const resolveLocationFromInput = async (input: string): Promise<{name: string, lat: number, lng: number} | null> => {
  const ai = getAI();
  const prompt = `
    You are a geographical assistant. 
    The user has provided the location: "${input}".
    
    1. Translate the location name to English.
    2. Provide the Latitude and Longitude for this location.
    
    Return the result in strict JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The English name of the location" },
            latitude: { type: Type.NUMBER, description: "Latitude" },
            longitude: { type: Type.NUMBER, description: "Longitude" }
          },
          required: ["name", "latitude", "longitude"]
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    if (json.name && json.latitude && json.longitude) {
      return { name: json.name, lat: json.latitude, lng: json.longitude };
    }
    return null;
  } catch (error) {
    console.error("Location Resolution Error:", error);
    return null;
  }
};

// Page 3: Route Analysis
export const analyzeRouteRisk = async (
  start: UserLocation, 
  end: UserLocation, 
  threats: Threat[]
): Promise<RouteAnalysis> => {
  const ai = getAI();

  // Filter threats to those roughly relevant (global list might be too big, but for now send concise list)
  // We send a simplified list to save tokens
  const threatContext = threats.map(t => `${t.title} (${t.severity}) at ${t.latitude},${t.longitude}`).join('; ');

  const prompt = `
    Analyze the risk of traveling between ${start.name} (${start.latitude}, ${start.longitude}) and ${end.name} (${end.latitude}, ${end.longitude}).
    
    Known Global Threats:
    ${threatContext}

    1. Determine the overall Risk Level (LOW, MEDIUM, HIGH, CRITICAL) based on threats near the direct path.
    2. Write a summary of the risks along the route.
    3. Suggest alternative routes or modes of travel if risks are high.

    Return JSON.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            summary: { type: Type.STRING },
            alternatives: { type: Type.STRING }
          },
          required: ["riskLevel", "summary", "alternatives"]
        }
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    return {
      riskLevel: result.riskLevel || 'UNKNOWN',
      summary: result.summary || 'Analysis failed.',
      alternatives: result.alternatives || 'None available.',
      timestamp: Date.now()
    };
  } catch (error) {
     console.error("Route Analysis Error:", error);
     return {
       riskLevel: 'LOW', // Fallback
       summary: "Could not analyze route risks due to service error.",
       alternatives: "Proceed with standard caution.",
       timestamp: Date.now()
     };
  }
};
