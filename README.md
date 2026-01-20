# Orange SIM Swap API Mock

A full-stack implementation that mocks the Orange Developer API for SIM Swap checking, built according to the GSMA CAMARA framework specifications.

![Orange SIM Swap API](https://img.shields.io/badge/GSMA-CAMARA-orange)
![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Use Cases](#use-cases)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

This project provides a mock implementation of Orange's SIM Swap API, which is part of the GSMA CAMARA framework for Network APIs. It helps developers:

- **Understand** the SIM Swap API workflow
- **Test** fraud prevention scenarios
- **Integrate** SIM swap detection into applications
- **Prototype** without needing real Orange API credentials

### What is SIM Swap Detection?

SIM swap fraud occurs when attackers transfer a victim's phone number to a new SIM card they control. This mock API simulates the detection mechanism used by telecom operators to identify recent SIM swap events, which is critical for:

- Banking transaction verification
- Account recovery processes
- SMS OTP security
- Identity verification

## ✨ Features

### OAuth 2.0 Authentication
- Client credentials flow simulation
- Bearer token generation
- Token expiry tracking

### CAMARA-Compliant Endpoints
- **`/camara/sim-swap/v1/check`** - Check if SIM swap occurred within a time period
- **`/camara/sim-swap/v1/retrieve-date`** - Get exact date of last SIM swap

### Mock Data & Scenarios
- Pre-configured test phone numbers
- Various time-based swap scenarios
- Realistic fraud detection logic

### Error Handling
- HTTP 400 (Bad Request)
- HTTP 422 (Unprocessable Entity)
- HTTP 500 (Internal Server Error)
- CAMARA-standard error codes

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm (for backend)
- Modern web browser (for frontend)
- Git

### Installation

#### Option 1: Clone and Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/orange-simswap-mock.git
cd orange-simswap-mock

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

#### Option 2: Run with Docker

```bash
# Build the Docker image
docker build -t orange-simswap-mock .

# Run the container
docker run -p 3000:3000 orange-simswap-mock
```

#### Option 3: Deploy to Vercel/Netlify

Simply connect your GitHub repository to Vercel or Netlify for automatic deployment.

## 📚 API Documentation

### Authentication

#### Get Access Token

```http
POST /oauth/v3/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET
```

**Response:**
```json
{
  "token_type": "Bearer",
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### SIM Swap Check

#### Check if SIM Swap Occurred

```http
POST /camara/sim-swap/v1/check
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "phoneNumber": "+33699901031",
  "maxAge": 240
}
```

**Parameters:**
- `phoneNumber` (string, required): Phone number in E.164 format
- `maxAge` (integer, optional): Period in hours to check (1-2400, default: 240)

**Response:**
```json
{
  "swapped": true,
  "phoneNumber": "+33699901031",
  "maxAge": 240,
  "lastSwapDate": "2026-01-18T14:30:00Z",
  "checkedAt": "2026-01-20T10:15:00Z"
}
```

#### Retrieve Last SIM Swap Date

```http
POST /camara/sim-swap/v1/retrieve-date
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "phoneNumber": "+33699901031"
}
```

**Response:**
```json
{
  "latestSimChange": "2026-01-18T14:30:00Z",
  "phoneNumber": "+33699901031",
  "retrievedAt": "2026-01-20T10:15:00Z"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "status": 400,
  "code": "INVALID_ARGUMENT",
  "message": "Invalid phone number format"
}
```

#### 422 Unprocessable Entity
```json
{
  "status": 422,
  "code": "NOT_SUPPORTED",
  "message": "Service not supported for this phoneNumber"
}
```

## 🧪 Testing

### Test Phone Numbers

Use these pre-configured phone numbers for testing different scenarios:

| Phone Number | Last SIM Swap | Scenario |
|-------------|---------------|----------|
| `+33699901031` | 2 days ago | Recent swap (fraud alert) |
| `+33699901032` | 10 days ago | Moderate risk |
| `+33699901033` | 1 hour ago | Critical fraud risk |
| `+33612345678` | 5 days ago | Standard case |
| `+34654654654` | 15 days ago | Low risk |

### Example Test Cases

#### Test Case 1: Recent SIM Swap Detection
```javascript
// Request
{
  "phoneNumber": "+33699901033",
  "maxAge": 24  // Check last 24 hours
}

// Expected: swapped = true (swap occurred 1 hour ago)
```

#### Test Case 2: No Recent Swap
```javascript
// Request
{
  "phoneNumber": "+34654654654",
  "maxAge": 240  // Check last 10 days
}

// Expected: swapped = false (swap was 15 days ago)
```

#### Test Case 3: Unsupported Number
```javascript
// Request
{
  "phoneNumber": "+1234567890",
  "maxAge": 240
}

// Expected: 422 error - NOT_SUPPORTED
```

### Running Automated Tests

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 📁 Project Structure

```
orange-simswap-mock/
├── src/
│   ├── components/
│   │   └── OrangeSimSwapMock.jsx    # Main React component
│   ├── services/
│   │   ├── auth.js                   # OAuth service
│   │   └── simswap.js                # SIM swap API service
│   ├── utils/
│   │   └── mockData.js               # Test data
│   └── App.jsx
├── public/
│   └── index.html
├── tests/
│   ├── auth.test.js
│   └── simswap.test.js
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

## 💼 Use Cases

### 1. Banking & Financial Services
Verify that a user's SIM hasn't been swapped before processing high-risk transactions:

```javascript
const response = await checkSimSwap(phoneNumber, 24);
if (response.swapped) {
  // Block transaction and require additional verification
  alert("Security alert: Recent SIM change detected");
}
```

### 2. Password Reset Security
Prevent account takeover during password reset:

```javascript
const response = await checkSimSwap(phoneNumber, 72);
if (response.swapped) {
  // Use alternative verification method
  sendEmailVerification();
} else {
  sendSMSOTP();
}
```

### 3. Account Recovery
Enhanced security for account recovery processes:

```javascript
const response = await retrieveSwapDate(phoneNumber);
const daysSinceSwap = calculateDays(response.latestSimChange);

if (daysSinceSwap < 7) {
  requireAdditionalDocuments();
}
```

## 🔒 Security Considerations

This is a **MOCK implementation** for development and testing purposes. In production:

- Use real Orange Developer API credentials
- Implement proper OAuth 2.0 token management
- Store credentials securely (environment variables, secrets manager)
- Use HTTPS for all API communications
- Implement rate limiting
- Add comprehensive logging and monitoring
- Follow GDPR and data protection regulations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📖 Resources

- [GSMA CAMARA Project](https://www.gsma.com/futurenetworks/gsma-open-gateway/)
- [Orange Developer Portal](https://developer.orange.com/)
- [CAMARA SIM Swap API Specification](https://github.com/camaraproject/SimSwap)
- [OAuth 2.0 Client Credentials Flow](https://oauth.net/2/grant-types/client-credentials/)

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourhandle](https://github.com/yourhandle)

## 🙏 Acknowledgments

- GSMA for the CAMARA framework
- Orange for their Network API documentation
- The open-source community

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Contact: your.email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

**⚠️ Disclaimer**: This is a mock implementation for educational and development purposes. It simulates the Orange SIM Swap API but does not connect to real telecom infrastructure. For production use, register at the [Orange Developer Portal](https://developer.orange.com/) to obtain real API credentials.