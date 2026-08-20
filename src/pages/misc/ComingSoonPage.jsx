import { useNavigate } from 'react-router-dom';
import { FaTools, FaCalendarAlt, FaRocket, FaArrowLeft, FaHourglassHalf, FaBell, FaEnvelope, FaChartPie, FaUsers, FaCog } from 'react-icons/fa';

const ComingSoonPage = () => {
  const navigate = useNavigate();
  
  const upcomingFeatures = [
    {
      icon: <FaChartPie className="w-5 h-5" />,
      title: 'Advanced Analytics',
      description: 'Predictive analytics and trend forecasting for sales performance',
      color: 'bg-primary-50 text-primary-700',
      iconColor: 'text-primary-600'
    },
    {
      icon: <FaUsers className="w-5 h-5" />,
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools and shared dashboards',
      color: 'bg-secondary-50 text-secondary-700',
      iconColor: 'text-secondary-600'
    },
    {
      icon: <FaCog className="w-5 h-5" />,
      title: 'Advanced Configuration',
      description: 'Customizable dashboards and advanced reporting settings',
      color: 'bg-warm-50 text-warm-700',
      iconColor: 'text-warm-600'
    }
  ];
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-50 mb-6">
            <FaTools className="w-10 h-10 text-primary-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Feature Coming Soon
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're working on exciting new features to enhance your experience. Stay tuned for updates!
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <FaHourglassHalf className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">Development Status</h2>
                <p className="text-sm text-gray-500">Current progress and estimated timeline</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              <FaCalendarAlt className="w-3 h-3" />
              <span>Q2 2024</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Development Progress</span>
                <span className="font-medium text-primary-600">65%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000"
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4">
              {upcomingFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    In Progress
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FaBell className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900">Get Notified</h2>
              <p className="text-sm text-gray-500">Be the first to know when new features launch</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors duration-200 text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 text-sm font-medium text-gray-700"
          >
            <FaArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/supervisor')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            <FaRocket className="w-4 h-4" />
            Go to Supervisor Dashboard
          </button>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Current version: Sales Intelligence Dashboard v1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Thank you for your patience as we build a better experience for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;