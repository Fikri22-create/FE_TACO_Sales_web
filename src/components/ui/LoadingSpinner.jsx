export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  showLabel = false,
  label = 'Loading...'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    gray: 'border-gray-400',
    white: 'border-white',
    success: 'border-success-500',
    warning: 'border-warning-500',
    error: 'border-error-500',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`inline-block ${sizeClasses[size]}`}>
        <div className={`w-full h-full border-2 rounded-full border-current border-t-transparent animate-spin-smooth ${colorClasses[color]}`}></div>
      </div>
      {showLabel && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
};

export const PageLoader = ({ title = 'TACO Sales Intelligence' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-warm-50 to-gray-100">
      <div className="text-center animate-fade-in">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 border-4 border-gray-300 border-t-transparent rounded-full animate-spin-smooth"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin-smooth"></div>
          </div>
        </div>
        <p className="text-gray-600 font-medium mb-2">Loading Dashboard</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 6, showHeader = true }) => {
  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex gap-3 mb-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div 
              key={`header-${i}`} 
              className={`h-10 bg-gray-200 rounded-lg animate-pulse-smooth ${
                i === 0 ? 'w-32' : 'flex-1'
              }`}
            ></div>
          ))}
        </div>
      )}
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="flex gap-3"
          style={{ animationDelay: `${rowIndex * 50}ms` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={`h-12 bg-gray-200 rounded-lg animate-pulse-smooth ${
                colIndex === 0 ? 'w-48' : 'flex-1'
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 3, variant = 'default' }) => {
  const heightClasses = {
    default: 'h-32',
    small: 'h-24',
    large: 'h-40',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={`bg-gray-200 rounded-xl animate-pulse-smooth ${heightClasses[variant]}`}
          style={{ animationDelay: `${i * 100}ms` }}
        ></div>
      ))}
    </div>
  );
};

export const ContentLoader = ({ type = 'card', count = 1 }) => {
  if (type === 'table') {
    return <TableSkeleton rows={count} columns={6} />;
  }
  
  if (type === 'card') {
    return <CardSkeleton count={count} />;
  }
  
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="h-20 bg-gray-200 rounded-lg animate-pulse-smooth"
          style={{ animationDelay: `${i * 75}ms` }}
        ></div>
      ))}
    </div>
  );
};

export const InlineLoader = ({ text = 'Loading', size = 'sm' }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <LoadingSpinner size={size} color="primary" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};