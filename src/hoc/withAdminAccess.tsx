import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const withAdminAccess = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAdminAccess = (props: any) => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("UserContext must be used within a UserProvider");
    }
    const { user, loading } = context;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user || user.role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAdminAccess;
};

export default withAdminAccess;
