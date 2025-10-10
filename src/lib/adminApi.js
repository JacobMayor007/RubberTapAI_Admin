// lib/adminApi.js
const BASE_URL = 'https://rubbertapai-backend.vercel.app';

export const adminApi = {
  // Get all users
  async getAllUsers(adminData) {
    try {
      const requestBody = {
        userId: adminData.userId,
        API_KEY: adminData.API_KEY,
        email: adminData.email
      };
      
      console.log("🔄 Sending request to admin/users:", {
        url: `${BASE_URL}/api/v1/admin/users`,
        body: requestBody
      });

      const response = await fetch(`${BASE_URL}/api/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response status:", response.status);
      
      const responseText = await response.text();
      console.log("📄 Response text:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText || 'No error message'}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      console.log("✅ Success response:", data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  },

  // Get user reports
  async getUserReports(adminData, reportedId) {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/admin/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          userId: adminData.userId,
          API_KEY: adminData.API_KEY,
          reportedId: reportedId,
          email: adminData.email
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw error;
    }
  },

  // Get all reports
  async getAllReports(adminData) {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/admin/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          userId: adminData.userId,
          API_KEY: adminData.API_KEY,
          email: adminData.email
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get rates and feedbacks
  async getRatesAndFeedbacks(adminData) {
    try {
      const requestBody = {
        userId: adminData.userId,
        API_KEY: adminData.API_KEY,
        email: adminData.email
      };
      
      console.log("🔄 Sending request to admin/rates:", requestBody);

      const response = await fetch(`${BASE_URL}/api/v1/admin/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Rates response status:", response.status);
      
      const responseText = await response.text();
      console.log("📄 Rates response text:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText || 'No error message'}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse rates response as JSON:", parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      console.log("✅ Rates success response:", data);
      return data;
    } catch (error) {
      console.error('Error fetching rates and feedbacks:', error);
      throw error;
    }
  },

  // Toggle user status (enable/disable)
  async toggleUserStatus(adminData, reportedId, enable) {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/admin/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          userId: adminData.userId,
          API_KEY: adminData.API_KEY,
          reportedId: reportedId,
          status: enable ? 'enable' : 'disable'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Test API connection
  async testAdminAPI(adminData) {
    try {
      console.log("🧪 Testing admin API connection...");
      
      const testBody = {
        userId: adminData.userId,
        API_KEY: adminData.API_KEY,
        email: adminData.email
      };

      console.log("📤 Test request body:", testBody);

      const response = await fetch(`${BASE_URL}/api/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testBody),
      });

      console.log("📡 Test response status:", response.status);
      
      const responseText = await response.text();
      console.log("📄 Test response text:", responseText);

      if (response.status === 403) {
        return {
          success: false,
          error: "403 Forbidden - Check API key and permissions"
        };
      } else if (response.status === 404) {
        return {
          success: false,
          error: "404 Not Found - Endpoint might not exist"
        };
      } else if (response.status === 401) {
        return {
          success: false,
          error: "401 Unauthorized - Invalid credentials"
        };
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        return {
          success: false,
          error: `Invalid JSON: ${responseText}`
        };
      }

      return {
        success: response.ok,
        data: data,
        status: response.status
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};