# Survey & Analytics Implementation Guide

## Overview
This document explains the survey feature and Google Analytics integration for the PetShop application.

## Survey Feature

### What It Does
- Displays a pet survey modal when users first visit the website
- Collects information about user's pet (type, age, weight, breed, name, health status)
- All fields are optional - users can skip without filling in information
- Survey only shows once per user (uses localStorage to track)
- Data is saved locally and sent to backend

### Survey Fields
1. **Loài thú cưng (Pet Type)** - Select: Mèo, Chó, Chim, Cá, Hamster, Thỏ, Khác
2. **Tuổi (Age)** - Number input (in months/years)
3. **Cân nặng (Weight)** - Number input in kg
4. **Giống loài (Breed)** - Text input
5. **Tên thú cưng (Pet Name)** - Text input
6. **Tình trạng sức khỏe (Health Status)** - Select: Khỏe mạnh, Bình thường, Nhạy cảm, Khác
7. **Ưu tiên gợi ý sản phẩm (Recommendation Preference)** - Select: Sản phẩm liên quan, Cùng danh mục, Cùng thẻ/nhãn, Tất cả
8. **Muốn biết thêm về thuật toán (Algorithm Interest)** - Checkbox

### Frontend Implementation
- **File**: `frontend/assets/js/main.js` - `SurveyManager` class
- **Styles**: `frontend/assets/css/style.css` - `.survey-modal` styles
- **HTML**: `frontend/index.html` - Survey modal markup

### Backend Implementation
- **File**: `backend/routes/survey.js`
- **Endpoints**:
  - `POST /api/survey` - Submit survey data
  - `GET /api/survey/responses` - Get all responses with statistics
  - `GET /api/survey/stats` - Get survey statistics only

### Data Storage
- **Local Storage**: Survey completion status and pet info (client-side)
- **Server Storage**: JSON file at `backend/data/survey_responses.json`

### Statistics Available
The backend calculates:
- Total survey responses
- Pet type distribution
- Health status distribution
- Recommendation algorithm used (Hybrid-Scoring-System)
- User recommendation preference distribution
- Number of users interested in algorithm information
- Average pet age
- Average pet weight

### Algorithm Information
The system tracks:
- **recommendationAlgorithm**: The algorithm used (currently "Hybrid-Scoring-System")
- **recommendationPreference**: User's preferred recommendation type (related_products, same_category, same_tags, all)
- **algorithmInfoInterest**: Whether the user wants to learn more about the algorithm

## Google Analytics Setup

### Current Status
You need to replace the placeholder Google Analytics ID in `frontend/index.html`

### How to Setup Google Analytics

1. **Create a Google Analytics Account** (if you don't have one)
   - Go to [Google Analytics](https://analytics.google.com/)
   - Sign in with your Google account
   - Click "Create an account"

2. **Add a Property**
   - Property name: "PetShop"
   - Time zone: Your location
   - Currency: VND (Vietnamese Dong)
   - Click "Create"

3. **Get Your Measurement ID**
   - In Google Analytics, go to "Admin" > "Property Settings"
   - Copy your Measurement ID (looks like: G-XXXXXXXXXX)

4. **Update Your HTML File**
   - In `frontend/index.html`, find the Google Analytics section (around line 6-14)
   - Replace both instances of `G-XXXXXXXXXX` with your actual Measurement ID

### Tracked Events

The application tracks these events in Google Analytics:

1. **survey_viewed**
   - When survey modal appears
   - Category: engagement

2. **survey_submitted**
   - When user submits survey form
   - Category: engagement
   - Includes: pet_type, pet_age, pet_health, recommendation_algo, recommendation_preference

3. **survey_skipped**
   - When user skips/closes survey
   - Category: engagement

### Algorithm Information Display
When a user checks the "Muốn biết thêm về thuật toán" checkbox, they will see:
- A detailed modal explaining the Hybrid-Scoring-System
- How the three criteria (related products, category, tags) are weighted
- Examples of how the algorithm calculates recommendations
- Benefits of the recommendation system

See [RECOMMENDATION_ALGORITHM.md](RECOMMENDATION_ALGORITHM.md) for full algorithm documentation.

### Viewing Analytics Data
- Go to [Google Analytics Dashboard](https://analytics.google.com/)
- Select your PetShop property
- View real-time visitor data in "Real-time" section
- View events in "Events" section

## Usage Examples

### Check Survey Statistics (Backend)
```bash
curl http://localhost:3000/api/survey/stats
```

Response:
```json
{
  "success": true,
  "statistics": {
    "total": 15,
    "petTypes": {
      "cat": 8,
      "dog": 5,
      "bird": 2
    },
    "healthStatus": {
      "healthy": 12,
      "sensitive": 3
    },
    "recommendationAlgorithm": {
      "Hybrid-Scoring-System": 15
    },
    "recommendationPreferences": {
      "related_products": 6,
      "same_category": 4,
      "same_tags": 2,
      "all": 3
    },
    "algorithmInfoInterest": 8,
    "averageAge": "3.5",
    "averageWeight": "4.2"
  }
}
```

### Get All Responses
```bash
curl http://localhost:3000/api/survey/responses
```

## Test the Feature

1. **Test Survey Display**
   - Open the website in an incognito/private window (no localStorage)
   - Survey modal should appear automatically
   - Try filling in the form or click "Bỏ qua" to skip

2. **Test Survey Storage**
   - After submitting, refresh the page
   - Survey should not appear again (stored in localStorage)
   - Clear localStorage to reset: Open DevTools > Application > Clear Site Data

3. **Test Analytics**
   - Check Google Analytics real-time dashboard
   - You should see survey_viewed event
   - Submit the survey and check for survey_submitted event

4. **Test Backend**
   - Submit a survey with pet information
   - Check if data is saved: `curl http://localhost:3000/api/survey/responses`
   - Check statistics: `curl http://localhost:3000/api/survey/stats`

## Configuration

### Disable Survey (if needed)
In `frontend/assets/js/main.js`, comment out the survey initialization:
```javascript
// const surveyManager = new SurveyManager();
```

### Customize Survey Delay
In `frontend/assets/js/main.js`, change the timeout value:
```javascript
setTimeout(() => this.showSurvey(), 500); // Change 500 (milliseconds)
```

### Enable Server Endpoint (optional)
The survey currently sends data to the backend even if it fails silently. To require successful submission:
- Edit `frontend/assets/js/main.js`
- Modify `handleSubmit` method to check backend response

## Privacy Considerations

- Survey data includes anonymized pet information (no personal PII in primary fields)
- Timestamp is recorded for each submission
- All data stored on server and localStorage
- Google Analytics anonymization is enabled (`anonymize_ip: true`)
- Consider GDPR/local privacy regulations

## File Structure

```
frontend/
├── index.html                    # Contains survey modal and Google Analytics
├── assets/
│   ├── css/
│   │   └── style.css            # Survey modal styles
│   └── js/
│       └── main.js              # Survey manager logic

backend/
├── routes/
│   └── survey.js                # Survey API endpoints
├── server.js                    # Updated with survey routes
└── data/
    └── survey_responses.json    # Survey data storage (auto-created)
```

## Next Steps

1. ✅ Set your Google Analytics Measurement ID
2. ✅ Test survey functionality
3. ✅ Monitor analytics dashboard
4. ✅ Review survey responses via API endpoints
5. Consider: Adding survey results analysis dashboard
6. Consider: Export survey data to CSV
7. Consider: Email notifications for new survey responses
