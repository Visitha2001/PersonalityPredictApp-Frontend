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

  const [formData, setFormData] = useState({});
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
    setFormData(SAMPLE_DATA[type]);
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
              {[
                { label: 'Do you have stage fear?', name: 'Stage_fear' },
                { label: 'Do you feel drained after socializing?', name: 'Drained_after_socializing' }
              ].map((group) => (
                <div key={group.name} className="space-y-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {group.label}
                  </label>
                  <div className="flex space-x-4">
                    {['Yes', 'No'].map((option) => (
                      <label key={option} className="inline-flex items-center">
                        <input
                          type="radio"
                          name={group.name}
                          value={option}
                          checked={formData[group.name] === option}
                          onChange={handleChange}
                          className={`h-4 w-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} focus:ring-indigo-500`}
                        />
                        <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

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