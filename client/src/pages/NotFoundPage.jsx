
import { NavLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="">
      <div className="">
        <h1 className="">404</h1>
        <p className="">Page non trouvée</p>
        <NavLink 
          to="/"
          className=""
        >
          Retour à l'accueil
        </NavLink>
      </div>
    </div>
  );
};