const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Store survey responses in a JSON file
const surveyDataFile = path.join(__dirname, '../data/survey_responses.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize survey file if it doesn't exist
if (!fs.existsSync(surveyDataFile)) {
  fs.writeFileSync(surveyDataFile, JSON.stringify([], null, 2));
}

// POST: Submit survey response
router.post('/', (req, res) => {
  try {
    const surveyData = req.body;

    // Read existing survey data
    let surveys = [];
    if (fs.existsSync(surveyDataFile)) {
      const fileContent = fs.readFileSync(surveyDataFile, 'utf-8');
      surveys = JSON.parse(fileContent);
    }

    // Add new survey response
    surveys.push({
      ...surveyData,
      id: surveys.length + 1,
      submittedAt: new Date().toISOString()
    });

    // Save updated survey data
    fs.writeFileSync(surveyDataFile, JSON.stringify(surveys, null, 2));

    // Log survey submission
    console.log(`Survey submitted: Pet type: ${surveyData.petType}, Age: ${surveyData.petAge}, Health: ${surveyData.petHealth}`);

    res.json({
      success: true,
      message: 'Survey data saved successfully',
      data: surveyData
    });
  } catch (error) {
    console.error('Error saving survey data:', error);
    res.status(500).json({
      success: false,
      error: 'Error saving survey data'
    });
  }
});

// GET: Retrieve all survey responses (for analytics)
router.get('/responses', (req, res) => {
  try {
    if (!fs.existsSync(surveyDataFile)) {
      return res.json({ success: true, data: [] });
    }

    const fileContent = fs.readFileSync(surveyDataFile, 'utf-8');
    const surveys = JSON.parse(fileContent);

    // Calculate statistics
    const stats = {
      total: surveys.length,
      petTypes: {},
      healthStatus: {},
      averageAge: 0,
      averageWeight: 0
    };

    let totalAge = 0;
    let ageCount = 0;
    let totalWeight = 0;
    let weightCount = 0;

    surveys.forEach(survey => {
      if (survey.petType) {
        stats.petTypes[survey.petType] = (stats.petTypes[survey.petType] || 0) + 1;
      }
      if (survey.petHealth) {
        stats.healthStatus[survey.petHealth] = (stats.healthStatus[survey.petHealth] || 0) + 1;
      }
      if (survey.petAge) {
        totalAge += parseInt(survey.petAge) || 0;
        ageCount++;
      }
      if (survey.petWeight) {
        totalWeight += parseFloat(survey.petWeight) || 0;
        weightCount++;
      }
    });

    stats.averageAge = ageCount > 0 ? (totalAge / ageCount).toFixed(1) : 0;
    stats.averageWeight = weightCount > 0 ? (totalWeight / weightCount).toFixed(1) : 0;

    res.json({
      success: true,
      data: surveys,
      statistics: stats
    });
  } catch (error) {
    console.error('Error retrieving survey data:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving survey data'
    });
  }
});

// GET: Get survey statistics
router.get('/stats', (req, res) => {
  try {
    if (!fs.existsSync(surveyDataFile)) {
      return res.json({ success: true, statistics: {} });
    }

    const fileContent = fs.readFileSync(surveyDataFile, 'utf-8');
    const surveys = JSON.parse(fileContent);

    // Calculate statistics
    const stats = {
      total: surveys.length,
      petTypes: {},
      healthStatus: {},
      averageAge: 0,
      averageWeight: 0
    };

    let totalAge = 0;
    let ageCount = 0;
    let totalWeight = 0;
    let weightCount = 0;

    surveys.forEach(survey => {
      if (survey.petType) {
        stats.petTypes[survey.petType] = (stats.petTypes[survey.petType] || 0) + 1;
      }
      if (survey.petHealth) {
        stats.healthStatus[survey.petHealth] = (stats.healthStatus[survey.petHealth] || 0) + 1;
      }
      if (survey.petAge) {
        totalAge += parseInt(survey.petAge) || 0;
        ageCount++;
      }
      if (survey.petWeight) {
        totalWeight += parseFloat(survey.petWeight) || 0;
        weightCount++;
      }
    });

    stats.averageAge = ageCount > 0 ? (totalAge / ageCount).toFixed(1) : 0;
    stats.averageWeight = weightCount > 0 ? (totalWeight / weightCount).toFixed(1) : 0;

    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error('Error calculating survey statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Error calculating survey statistics'
    });
  }
});

module.exports = router;
