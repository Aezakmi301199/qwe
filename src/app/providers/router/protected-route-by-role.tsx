import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../user-context';
import { ParserRole } from '../../../shared/enums/parser-role';
import { PagePath } from '../../../shared/enums/page-path';

type ProtectedRouteByRoleProps = {
  allowedRoles: ParserRole[];
  children: ReactNode;
};

const ProtectedRouteByRole: React.FC<ProtectedRouteByRoleProps> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const userRole = useUser().role.name;
  const hasAllowedRole = !!allowedRoles.includes(userRole);

  const checkRoles = () => {
    if (!allowedRoles.includes(userRole)) {
      navigate(PagePath.FLATS);
    }
  };

  useEffect(() => {
    checkRoles();
  }, []);

  return <>{hasAllowedRole ? children : null}</>;
};

export default ProtectedRouteByRole;
