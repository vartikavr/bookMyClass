import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notFound">
      <div className="pageLoading">
        <h1>404 Error!</h1>
        <h4>Page Not Found. </h4>
        <h4 className="ms-4">
          Go to <Link to="/">Home</Link>
        </h4>
      </div>
    </div>
  );
};

export default NotFound;
