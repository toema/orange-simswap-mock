import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Loader2, Phone, Clock, Send } from 'lucide-react';

const OrangeSimSwapMock = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [maxAge, setMaxAge] = useState(240);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);

  // Mock OAuth credentials
  const CLIENT_ID = 'demo_client_id';
  const CLIENT_SECRET = 'demo_client_secret';

  // Mock database of SIM swap events
  const mockSimSwapData = {
    '+33699901031': { lastSwap: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), swapped: true }, // 2 days ago
    '+33699901032': { lastSwap: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), swapped: false }, // 10 days ago
    '+33699901033': { lastSwap: new Date(Date.now() - 1 * 60 * 60 * 1000), swapped: true }, // 1 hour ago
    '+33612345678': { lastSwap: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), swapped: false }, // 5 days ago
    '+34654654654': { lastSwap: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), swapped: false }, // 15 days ago
  };

  // Mock OAuth Token Generation
  const getAccessToken = async () => {
    setTokenLoading(true);
    setError(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Mock token response
      const mockToken = {
        token_type: 'Bearer',
        access_token: `mock_${btoa(CLIENT_ID + Date.now()).slice(0, 32)}`,
        expires_in: 3600
      };

      setAccessToken(mockToken.access_token);
      setTokenLoading(false);
      return mockToken.access_token;
    } catch (err) {
      setError('Failed to obtain access token');
      setTokenLoading(false);
      throw err;
    }
  };

  // Mock SIM Swap Check API
  const checkSimSwap = async () => {
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    if (!accessToken) {
      setError('Please obtain an access token first');
      return;
    }

    if (maxAge < 1 || maxAge > 2400) {
      setError('maxAge must be between 1 and 2400 hours');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check if phone number exists in mock data
      if (!mockSimSwapData[phoneNumber]) {
        setError({
          status: 422,
          code: 'NOT_SUPPORTED',
          message: 'Service not supported for this phoneNumber'
        });
        setLoading(false);
        return;
      }

      const simData = mockSimSwapData[phoneNumber];
      const maxAgeMs = maxAge * 60 * 60 * 1000; // Convert hours to milliseconds
      const timeSinceSwap = Date.now() - simData.lastSwap.getTime();
      const swapped = timeSinceSwap <= maxAgeMs;

      // Mock successful response
      const response = {
        swapped: swapped,
        phoneNumber: phoneNumber,
        maxAge: maxAge,
        lastSwapDate: simData.lastSwap.toISOString(),
        checkedAt: new Date().toISOString()
      };

      setResult(response);
      setLoading(false);
    } catch (err) {
      setError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while checking SIM swap status'
      });
      setLoading(false);
    }
  };

  // Mock retrieve-date endpoint
  const retrieveSwapDate = async () => {
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    if (!accessToken) {
      setError('Please obtain an access token first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (!mockSimSwapData[phoneNumber]) {
        setError({
          status: 422,
          code: 'NOT_SUPPORTED',
          message: 'Service not supported for this phoneNumber'
        });
        setLoading(false);
        return;
      }

      const simData = mockSimSwapData[phoneNumber];
      const response = {
        latestSimChange: simData.lastSwap.toISOString(),
        phoneNumber: phoneNumber,
        retrievedAt: new Date().toISOString()
      };

      setResult(response);
      setLoading(false);
    } catch (err) {
      setError({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while retrieving SIM swap date'
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Orange SIM Swap API</h1>
              <p className="text-gray-600">CAMARA Framework Mock Implementation</p>
            </div>
          </div>
        </div>

        {/* OAuth Token Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. OAuth Authentication</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Client ID:</strong> {CLIENT_ID}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Grant Type:</strong> client_credentials
            </p>
          </div>
          
          <button
            onClick={getAccessToken}
            disabled={tokenLoading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {tokenLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Token...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Get Access Token
              </>
            )}
          </button>

          {accessToken && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Access Token:</p>
              <code className="text-xs bg-white p-2 rounded block overflow-x-auto text-green-700">
                {accessToken}
              </code>
              <p className="text-xs text-gray-500 mt-2">Expires in: 3600 seconds</p>
            </div>
          )}
        </div>

        {/* API Request Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. SIM Swap Check</h2>
          
          {/* Test Phone Numbers */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">Test Phone Numbers:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
              <div>• +33699901031 (swapped 2 days ago)</div>
              <div>• +33699901032 (swapped 10 days ago)</div>
              <div>• +33699901033 (swapped 1 hour ago)</div>
              <div>• +33612345678 (swapped 5 days ago)</div>
              <div>• +34654654654 (swapped 15 days ago)</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+33699901031"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Max Age (hours)
              </label>
              <input
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(parseInt(e.target.value))}
                min="1"
                max="2400"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Period to check for SIM swap (1-2400 hours)</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={checkSimSwap}
                disabled={loading || !accessToken}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Check SIM Swap
                  </>
                )}
              </button>

              <button
                onClick={retrieveSwapDate}
                disabled={loading || !accessToken}
                className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Retrieving...
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Get Swap Date
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {(result || error) && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">API Response</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-2">Error</h3>
                    {typeof error === 'string' ? (
                      <p className="text-red-700">{error}</p>
                    ) : (
                      <pre className="text-sm text-red-700 overflow-x-auto bg-white p-3 rounded">
                        {JSON.stringify(error, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-2">Success</h3>
                    
                    {result.swapped !== undefined && (
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          result.swapped 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {result.swapped ? '⚠️ SIM Swap Detected' : '✓ No Recent SIM Swap'}
                        </span>
                      </div>
                    )}
                    
                    <pre className="text-sm text-gray-700 overflow-x-auto bg-white p-3 rounded border border-gray-200">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm font-mono text-blue-600">POST /oauth/v3/token</code>
              <p className="text-sm text-gray-600 mt-2">Get OAuth access token for API authentication</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm font-mono text-blue-600">POST /camara/sim-swap/v1/check</code>
              <p className="text-sm text-gray-600 mt-2">Check if SIM swap occurred within specified period</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm font-mono text-blue-600">POST /camara/sim-swap/v1/retrieve-date</code>
              <p className="text-sm text-gray-600 mt-2">Get the exact date of the last SIM swap</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrangeSimSwapMock;