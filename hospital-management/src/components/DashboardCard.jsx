
const DashboardCard = ({ title, value, description, icon }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-top">
        <div>
          <p className="dashboard-card-title">{title}</p>

          <h2 className="dashboard-card-value">
            {value}
          </h2>
        </div>

        {icon && (
          <div className="dashboard-card-icon">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="dashboard-card-description">
          {description}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;
