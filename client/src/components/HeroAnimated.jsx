import { Link } from 'react-router-dom';

function HeroAnimated({ 
  icon = '☪', 
  title, 
  subtitle, 
  stats = [],
  breadcrumbs = []
}) {
  return (
    <div className="hero-animated">
      <div className="hero-bg-pattern"></div>
      <div className="hero-glow"></div>
      <div className="hero-content">
        {breadcrumbs.length > 0 && (
          <nav className="hero-breadcrumb" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {crumb.href ? (
                  <Link to={crumb.href}>{crumb.name}</Link>
                ) : (
                  <span className="current">{crumb.name}</span>
                )}
                {index < breadcrumbs.length - 1 && <span className="separator">/</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="hero-icon-wrapper">
          <div className="hero-icon-ring"></div>
          <div className="hero-icon-ring delay-1"></div>
          <div className="hero-icon-ring delay-2"></div>
          <span className="hero-icon">{icon}</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-title-main">{title}</span>
        </h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {stats.length > 0 && (
          <div className="hero-stats-mini">
            {stats.map((stat, index) => (
              <span key={index}>
                {stat}
                {index < stats.length - 1 && <span className="hero-dot">•</span>}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="hero-particles">
        <span className="particle"></span>
        <span className="particle"></span>
        <span className="particle"></span>
        <span className="particle"></span>
        <span className="particle"></span>
      </div>
    </div>
  );
}

export default HeroAnimated;
