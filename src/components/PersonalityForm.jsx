import { useState } from 'react';
import { predictPersonality } from '../../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { ResultDisplay } from './ResultCard';
import { toast } from 'react-toastify';
import { MoonIcon, SunIcon, ArrowPathIcon, BookmarkIcon } from '@heroicons/react/24/solid';

export const PersonalityForm = () => {
  // Sample data
  const SAMPLE_DATA = {
    introvert: {
      Time_spent_Alone: 8.5,
      Social_event_attendance: 1,
      Going_outside: 2,
      Friends_circle_size: 5,
      Post_frequency: 1,
      Stage_fear: 'Yes',
      Drained_after_socializing: 'Yes'
    },
    extrovert: {
      Time_spent_Alone: 2.5,
      Social_event_attendance: 5,
      Going_outside: 6,
      Friends_circle_size: 20,
      Post_frequency: 10,
      Stage_fear: 'No',
      Drained_after_socializing: 'No'
    }
  };

  // Initialize formData with default values
  const [formData, setFormData] = useState({
    Time_spent_Alone: 0,
    Social_event_attendance: 0,
    Going_outside: 0,
    Friends_circle_size: 0,
    Post_frequency: 0,
    Stage_fear: 'No',
    Drained_after_socializing: 'No'
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.endsWith('_size') || name.endsWith('frequency') || name.endsWith('attendance') 
        ? parseInt(value) 
        : name.endsWith('Alone') 
          ? parseFloat(value) 
          : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const prediction = await predictPersonality(formData);
      setResult(prediction);
      toast.success('Prediction successful!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      Time_spent_Alone: 0,
      Social_event_attendance: 0,
      Going_outside: 0,
      Friends_circle_size: 0,
      Post_frequency: 0,
      Stage_fear: 'No',
      Drained_after_socializing: 'No'
    });
    setResult(null);
    toast.info('Form cleared');
  };

  const loadSample = (type) => {
    // Ensure we're using a valid sample type
    if (!SAMPLE_DATA[type]) {
      toast.error('Invalid sample type');
      return;
    }
    
    // Create a new object to avoid potential reference issues
    const sampleData = { ...SAMPLE_DATA[type] };
    setFormData(sampleData);
    setResult(null);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sample loaded`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Theme Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 z-10"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
      </button>

      <div className="flex flex-col md:flex-row container mx-auto">
        {/* Form Section */}
        <div className={`w-1/2 mt-10 rounded-4xl px-8 py-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Personality Predictor
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={clearForm}
                  className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  title="Clear form"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
                <div className="relative group">
                  <button
                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    title="Load sample"
                  >
                    <BookmarkIcon className="h-5 w-5" />
                  </button>
                  <div className={`absolute right-0 mt-1 w-40 rounded-md shadow-lg py-1 z-20 ${darkMode ? 'bg-gray-700' : 'bg-white'} hidden group-hover:block`}>
                    <button
                      onClick={() => loadSample('introvert')}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white"
                    >
                      Introvert Sample
                    </button>
                    <button
                      onClick={() => loadSample('extrovert')}
                      className="block w-full text-left px-4 py-2 hover:bg-green-500 hover:text-white"
                    >
                      Extrovert Sample
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover if you're an Introvert or Extrovert
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields */}
              {[
                { label: 'Time spent alone (hours/day)', name: 'Time_spent_Alone', type: 'number', step: '0.1', min: 0, max: 24 },
                { label: 'Social events attended per week', name: 'Social_event_attendance', type: 'number', min: 0, max: 7 },
                { label: 'Times going outside per day', name: 'Going_outside', type: 'number', min: 0, max: 10 },
                { label: 'Close friends circle size', name: 'Friends_circle_size', type: 'number', min: 0, max: 100 },
                { label: 'Social media posts per week', name: 'Post_frequency', type: 'number', min: 0, max: 50 }
              ].map((field) => (
                <div key={field.name}>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    className={`w-full px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                    required
                  />
                </div>
              ))}

              {/* Radio Groups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    label: 'Do you have stage fear?', 
                    name: 'Stage_fear',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" />
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 7.5A.75.75 0 009 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 009 12h3.622a2.251 2.251 0 01-2.122 1.5H9a.75.75 0 000 1.5h1.5a2.251 2.251 0 012.122 1.5H9a.75.75 0 000 1.5h3.622A2.251 2.251 0 0110.5 18H9a.75.75 0 000 1.5h1.5a3.75 3.75 0 003.75-3.75V12a.75.75 0 00-.75-.75h-3.5a.75.75 0 01-.75-.75V9A.75.75 0 0112 7.5H9z" clipRule="evenodd" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Do you feel drained after socializing?', 
                    name: 'Drained_after_socializing',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z" clipRule="evenodd" />
                      </svg>
                    )
                  }
                ].map((group) => (
                  <div 
                    key={group.name} 
                    className={`p-4 rounded-lg border transition-all ${darkMode ? 
                      formData[group.name] === 'Yes' ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700 bg-gray-800' : 
                      formData[group.name] === 'Yes' ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-full ${darkMode ? 
                        formData[group.name] === 'Yes' ? 'bg-indigo-800 text-indigo-200' : 'bg-gray-700 text-gray-400' : 
                        formData[group.name] === 'Yes' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                        {group.icon}
                      </div>
                      <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {group.label}
                      </h3>
                    </div>
                    <div className="flex space-x-4">
                      {['Yes', 'No'].map((option) => (
                        <label 
                          key={option} 
                          className={`flex-1 py-2 px-4 rounded-md cursor-pointer transition-colors ${darkMode ? 
                            formData[group.name] === option ? 
                              option === 'Yes' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-white' : 
                              'bg-gray-700 hover:bg-gray-600 text-gray-300' : 
                            formData[group.name] === option ? 
                              option === 'Yes' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800' : 
                              'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                          <input
                            type="radio"
                            name={group.name}
                            value={option}
                            checked={formData[group.name] === option}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-center space-x-2">
                            <span>{option}</span>
                            {option === 'Yes' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                              </svg>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? <LoadingSpinner /> : 'Predict Personality'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Result Section */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {result ? (
            <ResultDisplay result={result} darkMode={darkMode} />
          ) : (
            <div className="text-center">
              <div className="mx-auto h-48 w-48 rounded-full bg-blue-300 flex items-center justify-center mb-6">
                <img
                  src={'/personality.png'}
                  alt="Personality prediction result"
                  className=""
                />
              </div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Submit the form to see your personality prediction
              </h3>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Or try our sample data using the buttons above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};