export const ResultDisplay = ({ result, darkMode }) => {
  if (!result) return null;

  const isIntrovert = result.prediction === 'Introvert';
  const imageSrc = isIntrovert ? '/introvert.png' : '/extrovert.png';
  
  // Dark mode adjustments
  const bgColor = darkMode ? 
    (isIntrovert ? 'bg-indigo-900/30' : 'bg-green-900/30') : 
    (isIntrovert ? 'bg-indigo-50' : 'bg-green-50');
  
  const borderColor = darkMode ? 
    (isIntrovert ? 'border-indigo-500' : 'border-green-500') : 
    (isIntrovert ? 'border-indigo-300' : 'border-green-300');
  
  const textColor = darkMode ? 
    (isIntrovert ? 'text-indigo-300' : 'text-green-300') : 
    (isIntrovert ? 'text-indigo-800' : 'text-green-800');

  return (
    <div className={`w-full p-8 ${bgColor} rounded-4xl border-l-4 ${borderColor} transition-all duration-300`}>
      <div className="flex flex-col items-center">
        <img 
          src={imageSrc} 
          alt={result.prediction} 
          className="w-58 h-58 mb-5 mt-10 object-contain drop-shadow-lg"
        />
        <h2 className={`text-3xl font-bold mb-10 ${textColor}`}>
          {result.prediction}
        </h2>
        
        <div className={`w-full rounded-3xl border ${borderColor} p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Confidence:</span>
            <div className="flex items-center">
              <div className={`w-32 h-2 rounded-full mr-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full ${isIntrovert ? 'bg-indigo-500' : 'bg-green-500'}`}
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
              <span className={`font-bold ${textColor}`}>
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          {Object.keys(result.indicators).length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Key Indicators:
              </h3>
              <ul className="space-y-3">
                {Object.entries(result.indicators).map(([key, value]) => (
                  <li key={key} className="flex items-start">
                    <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 ${isIntrovert ? 'bg-indigo-400' : 'bg-green-400'}`}></span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};